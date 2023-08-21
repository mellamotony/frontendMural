import { CdkDragDrop, CdkDragEnter, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PDFSource, PdfViewerComponent } from 'ng2-pdf-viewer';
import { MegaMenuItem } from 'primeng/api';
import { ImageDatasetItem, MuralDataSetItem, PanelItem, PdfsItem, TextDatasetItem, VideoDatasetItem } from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';

@Component({
  selector: 'app-edit-mural',
  templateUrl: './edit-mural.component.html',
  styleUrls: ['./edit-mural.component.css']
})
export class EditMuralComponent implements OnInit {

  @ViewChild('prueba') ContainerPrueba!: ElementRef<HTMLElement>;


  @ViewChildren(PdfViewerComponent) pdfViewers!: QueryList<PdfViewerComponent>;

  //Array para almacenar todos los datos del mural
  public IdMural:string = ''

  private DataMural?: MuralDataSetItem;

  // Variables para almacenar el texto por defecto de textArea
  valueInputs: TextDatasetItem[] = [];

  items: MegaMenuItem[] = [];
  //activeItem: MenuItem = {};
  //variable para validar la aparcion de la herramienta
  isActive: boolean = false;
  IsVidActive: boolean = false;
  isPdfActive: boolean = false;
  //Variables para cambiar estilos del texto
  color: string = '';
  //variable para familias de textos
  public fontFamilies: string[] = [
    'Arial',
    'Helvetica',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Lucida Console',
    'Impact',
    'Comic Sans MS',
  ];

  //Variable para los diferentes estilos de bordes
  public borderStyles: string[] = [
    'solid',
    'dotted',
    'dashed',
    'double',
    'inset',
    'outset',
  ];

  //Variable que guarda el elemento actual para la barra de herramientas
  public e?: MouseEvent;

  //formularios
  public toolsForm: FormGroup = this.fb.group({
    color: this.fb.control('black'),
    width: this.fb.control(''),
    height: this.fb.control(''),
    negrita: this.fb.control(false),
    background: this.fb.control('black'),
    alignment: this.fb.control('center'),
    fonts: this.fb.control(''),
    fontSize: this.fb.control(''),
    borderColor: this.fb.control('black'),
    borderStyle: this.fb.control(''),
    borderRadius: this.fb.control(''),
  });
  //variable para obtener el nombre del formulario
  public MuralnameForm = this.fb.group(
    {
      Muralname:this.fb.control('')
    }
  )
  // Declara la propiedad renderer con el tipo Renderer2
  private renderer!: Renderer2;

  images: string[] = [];

  panelItems: PanelItem[] = [];

  @ViewChild('contPanel') containerRef!: ElementRef<HTMLElement>;


  constructor(
    private mService:MuralService,
    private activateRoute:ActivatedRoute,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    ){ this.renderer = renderer;}

  ngOnInit(): void {
    //
    let nombreMural:string = '';
    this.activateRoute.paramMap.subscribe(params => {
      const idMural:string = params.get('id')!;
      console.log('ID actual:', idMural);
      this.mService.postIdmurl(idMural).subscribe((mural) =>{
        console.log(mural)
        //ingresando nombre del mural
        nombreMural = mural[0].nombrem!
        this.MuralnameForm.controls['Muralname'].setValue(nombreMural)
        //ingresando los textos

        mural[0].textos.forEach((data)=>{
          //const {backgroundcolor,border_radius,border_color,border_style,color,font,font_size,font_weight,height,width,id_mural,posx,posy,sangria,valor} = data
          data.posx = Number(data.posx)
          data.posy = Number(data.posy)
          this.valueInputs.push(data)
          console.log('textos',data.posy)

        })

        //capturando los datos para imagenes
        mural[0].imagenes.forEach((data)=>{
          console.log('imagenes: ',data)
          const arraytype = data.url.split('.')
          const type = arraytype[1]

          const datas:PanelItem = {
            file:{
               lastModified: 0,
               name: data.alt,
               size: 1,
               type: 'image/'+type,

             }as File ,
            url:data.url,
            type:'image/'+type,
            border_style: data.border_style,
            border_radius:data.border_radius,
            border_color:data.border_color,
            posx: Number(data.posx),
            posy:Number(data.posy),
            height:Number(data.height),
            width: Number(data.width)
          }
          console.log('datas: ',datas)
          this.panelItems.push(datas)
        })

        //capturando los videos
        mural[0].videos.forEach((data)=>{
          const arraytype = data.url_video.split('.')
          const type = arraytype[1]
          console.log('videos: ',data)
          let datas:PanelItem = {
            file:{
               lastModified: 0,
               name: '',
               size: 1,
               type: 'video/'+type,
             }as File ,
            url:data.url_video,
            type:'video/'+type,
            videos:data
          }
          console.log('tipo: ',type)
          this.panelItems.push(datas)
        })

        //capturando los pdfs
        mural[0].pdfs.forEach((data)=>{
          console.log('pdfs: ',data)
          const arraytype = data.url_pdfs!.split('.')
          const type = arraytype[1]
          let datas:PanelItem = {
            file:{
               lastModified: 0,
               name: '',
               size: 1,
               type: 'application/'+type,
             }as File ,
            url:data.url_pdfs!,
            type:'application/'+type,
            pdfs:data
          }
          console.log('tipo: ',type)
          this.panelItems.push(datas)


        })

      })
    });

    this.items = [
      {
        label: 'Texto',
        icon: 'pi pi-fw pi-language',
        command: () => {
          this.createTxt();
        },
      },
      {
        label: 'Subir archivo',
        icon: 'pi pi-fw pi-file',
        items: [
          [
            {
              label: 'Imagen',
              items: [
                {
                  label: 'Tipo:Jpg',
                  command: () => {
                    this.uploadFile('image/jpeg');
                  },
                },
                {
                  label: 'Tipo:Png',
                  command: () => {
                    this.uploadFile('image/png');
                  },
                },
              ],
            },
          ],
          [
            {
              label: 'Video',
              items: [
                {
                  label: 'Tipo:Mp4',
                  command: () => {
                    this.uploadFile('video/mp4');
                  },
                },
              ],
            },
            {
              label: 'Pdf',
              items: [
                {
                  label: 'Subir',
                  command: () => {
                    this.uploadFile('application/pdf');
                  },
                },
              ],
            },
          ],
        ],
        // command:()=>{
        //   alert('subiendo_:...')
        // }
      },
    ];
  }


  ngAfterViewInit(): void {
    console.log('cargado');
  }


  //propio de cdk angular
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  entered(event: CdkDragEnter) {
    event.item.data =
      event.item.element.nativeElement.querySelector('img')?.src;

    console.log(event.item.data);
  }

  //crear
  createTxt() {
    const txt:TextDatasetItem = {
      id_mural:'',
      valor: 'Ingrese el texto',
      font:'',
      font_size:'',
      posx:0,
      posy:0,
      height:0,
      width:0,
      color:'',
      border_color:'',
      border_radius:'',
      border_style:'',
      backgroundcolor:'',
      font_weight:'',
      sangria:''
    }
    this.valueInputs.push(txt);
  }
  //Crear archivos
  createFileInput() {
    const divContainer = document.createElement('div');
  }

  handleFileInput(event: any): void {
    const files: File[] = Array.from(event.target.files);
    console.log('archivos: ',event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const item: PanelItem = {
          file: file,
          type: file.type,
          url: e.target?.result as string,
        };
        this.panelItems.push(item);
      };
      reader.readAsDataURL(file);
    });
  }

  uploadFile(acceptedType: string): void {
    const inputElement: HTMLInputElement | null =
      document.querySelector('#fileInput');
    if (inputElement) {
      inputElement.accept = acceptedType;
      inputElement.click();
    }
  }

  //click al elemento ContainerTxt
  handleClick(e: MouseEvent) {
    this.IsVidActive = false;
    if ((this.isPdfActive = true)) {
      this.isPdfActive = false;
    }
    console.log('El elemento fue presionado');
    console.log(e);
    const element = e.target as HTMLElement;

    this.isActive = true;

    this.e = e;
  }

  //click a los elementos de video,pdf e imagenes
  handleClickMultimedia(e: MouseEvent) {
    const newElement = e.target as HTMLElement;
    this.isActive = false;
    if (this.isPdfActive = true) {
      this.isPdfActive = false;

    }
    console.log('El elemento fue presionado');

    console.log('debuger: ',newElement);
    if (newElement.className == 'textLayer') {

      this.isPdfActive = true;
      this.IsVidActive = false;
      this.e = e;
      return;
    }
    //si se cumple quiere decir que es video o imagen
    if(newElement.className == 'ng-star-inserted'){
      this.IsVidActive = true;
    }


    this.e = e;
  }

  //funcion para cambiar cambiar la barra de herramientas de texto
  getChangesStyles() {
    const element = this.e?.target as HTMLElement;
    console.log('el elemento:', element);
    element.style.color = this.toolsForm.controls['color'].value;

    element.style.backgroundColor = this.toolsForm.controls['background'].value;

    element.style.borderColor = this.toolsForm.controls['borderColor'].value;

    element.style.borderStyle = this.toolsForm.controls['borderStyle'].value;

    element.style.borderRadius =
      this.toolsForm.controls['borderRadius'].value + '%';

    element.style.width = this.toolsForm.controls['width'].value + 'px';

    element.style.height = this.toolsForm.controls['height'].value + 'px';

    if (this.toolsForm.controls['negrita'].value === true) {
      element.style.fontWeight = 'bolder';
    }

    element.style.textAlign = this.toolsForm.controls['alignment'].value;

    element.style.fontFamily = this.toolsForm.controls['fonts'].value;

    element.style.fontSize = this.toolsForm.controls['fontSize'].value + 'px';
    this.isActive = false;
  }
  //funcion para cambiar cambiar la barra de herramientas de multimedia
  changeStyles() {
    const element = this.e?.target as HTMLElement;
    //obtenemos el elemento padre
    const parentElement = element.parentElement;

    parentElement!.style.borderColor =
      this.toolsForm.controls['borderColor'].value;

    parentElement!.style.borderStyle =
      this.toolsForm.controls['borderStyle'].value;

    parentElement!.style.borderRadius =
      this.toolsForm.controls['borderRadius'].value + '%';

    parentElement!.style.width = this.toolsForm.controls['width'].value + 'px';

    parentElement!.style.height =
      this.toolsForm.controls['height'].value + 'px';

    this.IsVidActive = false;
  }

  //funcion para cambiar cambiar la barra de herramientas Pdfs
  changeStylesPdfs() {
    const element = this.e?.target as HTMLElement;
    console.log(element);
    //obtenemos el elemento padre
    const parentElement = element.parentElement;
    const raiz =
      parentElement?.parentElement?.parentElement?.parentElement?.parentElement;

    console.log('asdsad', raiz);

    raiz!.style.borderColor = this.toolsForm.controls['borderColor'].value;

    raiz!.style.borderStyle = this.toolsForm.controls['borderStyle'].value;

    raiz!.style.borderRadius =
      this.toolsForm.controls['borderRadius'].value + '%';

    raiz!.style.width = this.toolsForm.controls['width'].value + 'px';

    raiz!.style.height = this.toolsForm.controls['height'].value + 'px';

    this.isPdfActive = false;
  }

  //borrar cualquier elemento
  DeleteElement() {
    const element = this.e?.target as HTMLElement;

    element.remove();
    //desaparece la barra de herramientas
    this.isActive = false;
  }
  //borrar el elemento padre
  DeleteParent() {
    const element = this.e?.target as HTMLElement;
    console.log('eliminado de elementos')
    console.log({ file: this.panelItems, elemento: element });
    if (element.parentElement) {
      element.parentElement.remove();
    }

    //desaparece la barra de herramientas
    this.IsVidActive = false;
  }
  //borrar el elemento padre del pdf
  DeletePdfs() {
    const element = this.e?.target as HTMLElement;

    console.log(this.e)
    console.log(this.panelItems)
    if (element.parentElement) {
      element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.remove();
    }

    //desaparece la barra de herramientas
    this.isPdfActive = false;


  }

  //funcion para enviar los datos
  OnSaveMural() {

    //obtener valores del mural
    const MuralData = this.containerRef.nativeElement;

    const textAreas =
      this.containerRef.nativeElement.querySelectorAll('textarea');
    const images = this.containerRef.nativeElement.querySelectorAll('img');
    const videos = this.containerRef.nativeElement.querySelectorAll('video');
    const pdfs = this.containerRef.nativeElement.querySelectorAll('pdf-viewer');
    //copia del array con los archivos subidos en el mural separados por tipo
    let imgArray:PanelItem [] = []
    let videoArray:PanelItem [] = []
    let pdfArray:PanelItem [] = []

    this.panelItems.forEach((item)=>{
      if(item.type == "image/jpeg" || item.type == "image/png" ){
        imgArray.push(item)
      }
      if(item.type == "video/mp4" ){
        videoArray.push(item)
      }
      if(item.type == "application/pdf" ){
        pdfArray.push(item)
      }
    })
    //Array de cada elemento

    const Videos: VideoDatasetItem[] = [];
    const Texts: TextDatasetItem[] = [];
    const DataImagenes: ImageDatasetItem[] = [];
    const DataPdfs:PdfsItem[] = [];

    // Recorrer los textAreas y obtener sus valores
    textAreas.forEach((textArea: HTMLTextAreaElement) => {
      const valueTexts: TextDatasetItem = {
        id_mural:localStorage.getItem('id_mural'),
        valor: textArea.value,
        font: textArea.style.fontFamily,
        font_size: textArea.style.fontSize,
        posx: textArea.offsetLeft,
        posy: textArea.offsetTop,
        height: parseInt(textArea.style.height),
        width: parseInt( textArea.style.width),
        color: textArea.style.color,
        border_color: textArea.style.borderColor,
        border_radius:textArea.style.borderRadius,
        backgroundcolor: textArea.style.backgroundColor,
        border_style:textArea.style.borderStyle,
        font_weight:  textArea.style.fontWeight,
        sangria:  textArea.style.textAlign,
      };
      console.log('alto:',textArea.style.height)
      Texts.push(valueTexts);

    });



    // Recorrer las imágenes y obtener sus atributos o valores
    images.forEach((image: HTMLImageElement,i:number ) => {
          const panelItem = imgArray[i]
          const valueImages: ImageDatasetItem = {
            id_mural:localStorage.getItem('id_mural'),
            file: panelItem.file,
            url: panelItem.url,
            alt: image.alt,
            height: image.height,
            width: image.width,
            posx: image.x,
            posy: image.y,
            border_color:image.parentElement!.style.borderColor,
            border_radius:image.parentElement!.style.borderRadius,
            border_style:image.parentElement!.style.borderStyle,
          };
          DataImagenes.push(valueImages);

    });

    // Recorrer los videos y obtener sus atributos o valores
    videos.forEach((video: HTMLVideoElement, i:number) => {
      const panelItem = videoArray[i];


      const rect = video.getBoundingClientRect();
      const posX = rect.left;
      const posY = rect.top;
      const videoSrc = video.currentSrc;



      const DataVideo: VideoDatasetItem = {
        id_mural:localStorage.getItem('id_mural'),
        url_video:panelItem.url,
        height: video.offsetHeight,
        width: video.offsetWidth,
        posx: posX,
        posy: posY,
        formato:'mp4',
        duration:video.duration,
        border_color:video.parentElement!.style.borderColor,
        border_radius:video.parentElement!.style.borderRadius,
        border_style:video.parentElement!.style.borderStyle,
        file:panelItem.file
      };

      Videos.push(DataVideo);


    });



    // Se recorre los pdfViewer y se almacena sus valores en un objeto

    pdfs.forEach((pdf: PDFSource, i:number)=>{

      //para obtener la posX  y en Y

      const computedStyle = pdf as HTMLElement;
      const {x,y,height,width} = computedStyle.getBoundingClientRect()

      const panelItem = pdfArray[i];


      const DataPdf:PdfsItem = {
        id_mural:localStorage.getItem('id_mural'),
        url_pdfs:panelItem.url,
        height:height,
        width:width,
        posx:x,
        posy:y,
        border_color:computedStyle.parentElement!.style.borderColor,
        border_style:computedStyle.parentElement!.style.borderStyle,
        border_radius:computedStyle.parentElement!.style.borderRadius,
        file:panelItem.file
      }
      DataPdfs.push(DataPdf)
    });
    //agregar los enlaces a la url del pdf
    // if (this.pdfViewers.length === DataPdfs.length) {
    //   let pdfViewersArray = this.pdfViewers.toArray();
    //   for (let i = 0; i < pdfViewersArray.length; i++) {
    //     DataPdfs[i].url_pdfs = pdfViewersArray[i].src as string;
    //   }
    // } else {
    //   console.error('Los arrays pdfViewers y DataPdfs no tienen la misma longitud');
    // }


    //se guardan en el array el objeto con todo sus elementos
    let nombreMural = this.MuralnameForm.controls['Muralname'].value
    //verificamos si se le puso nombre al mural
    if(!nombreMural){
        nombreMural = 'sin nombre'
    }

    this.DataMural = {
      id_mural:localStorage.getItem('id_mural'),
      id_user:localStorage.getItem('id_user'),
      nombrem:nombreMural! ,
      height: MuralData.offsetWidth,
      width: MuralData.offsetHeight,
      textos: Texts,
      imagenes: DataImagenes,
      videos: Videos,
      pdfs:DataPdfs,
      estado: 'en espera',
    };
    console.log('Enviando datos:', this.DataMural);
    console.log(this.panelItems)
    //Endepoint para actualizar
    // //this.mService.postData(this.DataMural).subscribe((data)=>{
    //   console.log(data)
    // }  );

  }


  //boton para ocultar
  ocultarToolbarTxt(){

    this.isActive = !this.isActive;


  }

  ocultarToolbarMulti(){
    this.IsVidActive = !this.IsVidActive;
  }

  ocultarToolbarPdf(){
     this.isPdfActive = !this.isPdfActive
  }

}
