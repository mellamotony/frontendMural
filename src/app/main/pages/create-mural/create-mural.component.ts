
import { style } from '@angular/animations';
import { PdfViewerComponent,PDFSource ,PDFProgressData} from 'ng2-pdf-viewer';
import {
  CdkDragDrop,
  CdkDragEnter,
  copyArrayItem,
  moveItemInArray,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  Input,QueryList, ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MegaMenuItem, MenuItem } from 'primeng/api';

import {
  ImageDatasetItem,
  MuralDataSetItem,
  myFile,
  PanelItem,
  PdfsItem,
  TextDatasetItem,
  VideoDatasetItem,
} from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';

@Component({
  selector: 'app-create-mural',
  templateUrl: './create-mural.component.html',
  styleUrls: ['./create-mural.component.css'],
})
export class CreateMuralComponent implements OnInit, AfterViewInit {
  @ViewChild('prueba') ContainerPrueba!: ElementRef<HTMLElement>;
  @ViewChildren(PdfViewerComponent) pdfViewers!: QueryList<PdfViewerComponent>;

  //Array para almacenar todos los datos del mural
  public IdMural:string = ''

  private DataMural?: MuralDataSetItem;

  // Variables para almacenar el texto por defecto de textArea
  valueInputs: string[] = [];

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

  // Declara la propiedad renderer con el tipo Renderer2
  private renderer!: Renderer2;

  images: string[] = [];

  panelItems: PanelItem[] = [];

  @ViewChild('contPanel') containerRef!: ElementRef<HTMLElement>;

  //constructor
  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef,
    renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private mService: MuralService
  ) {
    this.renderer = renderer;
  }

  ngAfterViewInit(): void {
    console.log('cargado');
  }

  ngOnInit(): void {



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

    // this.activeItem = this.items[0];
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
    this.valueInputs.push('valor por defecto');
  }
  //Crear archivos
  createFileInput() {
    const divContainer = document.createElement('div');
  }

  handleFileInput(event: any): void {
    const files: File[] = Array.from(event.target.files);
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
    this.isActive = false;
    if ((this.isPdfActive = true)) {
      this.isPdfActive = false;
    }
    console.log('El elemento fue presionado');
    const newElement = e.target as HTMLElement;
    if (newElement.className == 'textLayer') {
      this.isPdfActive = true;
      this.IsVidActive = false;
      this.e = e;
      return;
    }
    this.IsVidActive = true;

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

    if (element.parentElement) {
      element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.remove();
    }

    //desaparece la barra de herramientas
    this.IsVidActive = false;
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

    // recorrer el Array de panelItems y guardar en un formData
    const arrayDatos: FormData[] = []
    this.panelItems.forEach((item) =>{
      const formData = new FormData();
      formData.append('file', item.file);

      formData.append('type', item.type);
      formData.append('url', item.url);
      arrayDatos.push(formData)

    })
    console.log('archivos: ',arrayDatos)

    // Recorrer las imágenes y obtener sus atributos o valores
    images.forEach((image: HTMLImageElement,i:number ) => {
          const panelItem = imgArray[i]
          const valueImages: ImageDatasetItem = {
            id_mural:localStorage.getItem('id_mural'),
            file: panelItem.file,
            url: image.src,
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
        url_video: video.src,
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
        url_pdfs:'',
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
    if (this.pdfViewers.length === DataPdfs.length) {
      let pdfViewersArray = this.pdfViewers.toArray();
      for (let i = 0; i < pdfViewersArray.length; i++) {
        DataPdfs[i].url_pdfs = pdfViewersArray[i].src as string;
      }
    } else {
      console.error('Los arrays pdfViewers y DataPdfs no tienen la misma longitud');
    }


    //se guardan en el array el objeto con todo sus elementos
    this.DataMural = {
      id_mural:localStorage.getItem('id_mural'),
      id_user:localStorage.getItem('id_user'),
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
    // this.mService.postData(this.DataMural).subscribe((data)=>{
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
