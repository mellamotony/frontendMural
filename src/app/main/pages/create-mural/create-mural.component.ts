import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { PdfViewerComponent, PDFSource, PDFProgressData } from 'ng2-pdf-viewer';
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
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MegaMenuItem, MenuItem, Message } from 'primeng/api';

import {
  editors,
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
  @ViewChild('menu', { static: false }) Menu!: ElementRef<HTMLElement>;
  @ViewChild('contPanel') contPanel: ElementRef | undefined;

  //variable para manejar el bloqueo de clicks
  public enEspera: boolean = false;

  private isMouseMiddleButtonDown = false;
  private prevX = 0;
  private prevY = 0;
  //spinner
 public isactive:boolean = false;

 //variable para desactivar la ventana moral
 public modal:boolean = false;

  //variable para almacenar usuarios
  public users: editors[] = [];
  //variable para estado del modal
  public editState: boolean = false;
  //variable para el valor del idRol
  public idRol: string = '';

  messages: Message[] = [
    {
      severity: 'success',
      summary: 'Success',
      detail: 'Mural guardado con éxito',
    },
  ];
  exito: boolean = false;
  isBlock = false;
  //manejador de zoom variables
  zoomLevel: number = 100; // Inicialmente, sin zoom (100%).

  //id para los elementos multimedia
  public id: number = 0;
  //Array para almacenar todos los datos del mural
  public IdMural: string = '';

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
  //variable para obtener el nombre del formulario
  public MuralnameForm = this.fb.group({
    Muralname: this.fb.control(''),
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
    private mService: MuralService,
    private ruta: Router
  ) {
    this.renderer = renderer;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    //cargar los editores para elmodal
    this.mService.getUsers().subscribe((data) => {
      data.map((dat) => {
        if (dat.rol == 'editor') {
          this.users.push(dat);
        }
      });

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
      {
        label: 'Guardar/Enviar',
        icon: 'pi pi-fw pi-save',
        command: () => {
          this.OnSaveMural();
        }
      },
      // {
      //   // label:this.zoomLevel.toString()+'%',
      //   icon: 'pi pi-plus-circle',
      //   command: () => {
      //     this.zoomIn();
      //   },
      // },
      // {
      //   // label:this.zoomLevel.toString()+'%',
      //   icon: 'pi pi-minus-circle',
      //   command: () => {
      //     this.zoomOut();
      //   },
      // },{
      //   icon:'pi pi-undo',
      //   command:() =>{
      //     this.zoomClear();
      //   }
      // }
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

    const maxSizeInBytes = 10485760;
    if(files[0].size < 0){ return }
    if(files[0].size > maxSizeInBytes){
      this.exito = true
      this.messages.pop()
      this.messages.push({
        severity: 'error',
        detail: 'No debe superar el tamaño máximo de 10MB',
      },)
      setTimeout(() => {
        this.exito = false;
      }, 3000);
      const fileInput: HTMLInputElement = event.target;
      fileInput.value = '';
      return;
    }
    this.id = this.id + 1;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const item: PanelItem = {
          file: file,
          type: file.type,
          url: e.target?.result as string,
          id: this.id,
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


    const newElement = e.target as HTMLElement;
    if (newElement.className == 'textLayer') {

      if (newElement.nodeName !== 'DIV') {
        this.isPdfActive = false;
        this.IsVidActive = false;

        return;
      }

      this.isPdfActive = true;
      this.IsVidActive = false;
      this.e = e;
      return;
    }
    this.IsVidActive = true;

    this.e = e;
  }

  // Define una variable para almacenar el elemento seleccionado
  private selectedElement: HTMLElement | null = null;

  // Evento para seleccionar un elemento
  selectElement(e: MouseEvent) {
    this.selectedElement = e.target as HTMLElement;

  }

  // Función para eliminar el elemento seleccionado
  deleteSelectedElement() {
    if (this.selectedElement) {
      this.selectedElement.remove();
      this.selectedElement = null; // Restablecer el elemento seleccionado a nulo
    }
  }

  // Resto de tu código

  // handleClickMultimedia(e: MouseEvent) {
  //   this.isActive = false;

  //   const clickedElement = e.target as HTMLElement;

  //   // Verificar el tipo de elemento y aplicar lógica específica si es necesario
  //   if (clickedElement.nodeName === 'PDF-VIEWER') {
  //     // Lógica específica para elementos PDF
  //     // Eliminar el elemento o su padre según la estructura del DOM
  //     const pdfContainer = clickedElement.parentElement;
  //     if (pdfContainer) {
  //       pdfContainer.remove();
  //     }
  //   } else if (clickedElement.nodeName === 'VIDEO') {
  //     // Lógica específica para elementos de video
  //     // Eliminar el elemento o su padre según la estructura del DOM
  //     const videoContainer = clickedElement.parentElement;
  //     if (videoContainer) {
  //       videoContainer.remove();
  //     }
  //   } else if (clickedElement.nodeName === 'IMG') {
  //     // Lógica específica para elementos de imagen
  //     // Eliminar el elemento o su padre según la estructura del DOM
  //     const imgContainer = clickedElement.parentElement;
  //     if (imgContainer) {
  //       imgContainer.remove();
  //     }
  //   }

  //   // Resto de tu lógica
  // }

  //eliminar
  deleteFile() {
    const element = this.e?.target as HTMLElement;


  }

  //funcion para cambiar cambiar la barra de herramientas de texto
  getChangesStyles() {
    const element = this.e?.target as HTMLElement;


    switch (true) {
      case this.toolsForm.controls['width'].value > 790:
        this.messages[0].severity = 'error';
        this.messages[0].summary = 'Error';
        this.messages[0].detail = 'Está superando el máximo de ancho del mural';

        this.exito = true;
        setTimeout(() => {
          this.exito = false;
        }, 1000);
        return;

      case this.toolsForm.controls['height'].value > 450:
        this.messages[0].severity = 'error';
        this.messages[0].summary = 'Error';
        this.messages[0].detail = 'Está superando el máximo de alto del mural';

        this.exito = true;
        setTimeout(() => {
          this.exito = false;
        }, 1000);
        return;

      case this.toolsForm.controls['fontSize'].value > 50:
        this.messages[0].severity = 'error';
        this.messages[0].summary = 'Error';
        this.messages[0].detail =
          'Está superando el tamaño de fuente máximo permitido';

        this.exito = true;
        setTimeout(() => {
          this.exito = false;
        }, 1000);

        return;
    }
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

    if (element.classList.contains('panel-i')) {
      switch (true) {
        case this.toolsForm.controls['width'].value > 790:
          this.messages[0].severity = 'error';
          this.messages[0].summary = 'Error';
          this.messages[0].detail =
            'Está superando el máximo de ancho del mural';

          this.exito = true;
          setTimeout(() => {
            this.exito = false;
          }, 1000);
          return;

        case this.toolsForm.controls['height'].value > 450:
          this.messages[0].severity = 'error';
          this.messages[0].summary = 'Error';
          this.messages[0].detail =
            'Está superando el máximo de alto del mural';

          this.exito = true;
          setTimeout(() => {
            this.exito = false;
          }, 1000);
          return;
      }

      element!.style.borderColor = this.toolsForm.controls['borderColor'].value;

      element!.style.borderStyle = this.toolsForm.controls['borderStyle'].value;

      element!.style.borderRadius =
        this.toolsForm.controls['borderRadius'].value + '%';

      element!.style.width = this.toolsForm.controls['width'].value + 'px';

      element!.style.height = this.toolsForm.controls['height'].value + 'px';

      this.IsVidActive = false;
    } else {
      const parentElement = element.parentElement;
      switch (true) {
        case this.toolsForm.controls['width'].value > 790:
          this.messages[0].severity = 'error';
          this.messages[0].summary = 'Error';
          this.messages[0].detail =
            'Está superando el máximo de ancho del mural';

          this.exito = true;
          setTimeout(() => {
            this.exito = false;
          }, 1000);

          return;

        case this.toolsForm.controls['height'].value > 450:
          this.messages[0].severity = 'error';
          this.messages[0].summary = 'Error';
          this.messages[0].detail =
            'Está superando el máximo de alto del mural';

          this.exito = true;
          setTimeout(() => {
            this.exito = false;
          }, 1000);
          return;
      }
      parentElement!.style.borderColor =
        this.toolsForm.controls['borderColor'].value;

      parentElement!.style.borderStyle =
        this.toolsForm.controls['borderStyle'].value;

      parentElement!.style.borderRadius =
        this.toolsForm.controls['borderRadius'].value + '%';

      parentElement!.style.width =
        this.toolsForm.controls['width'].value + 'px';

      parentElement!.style.height =
        this.toolsForm.controls['height'].value + 'px';

      this.IsVidActive = false;
    }
  }

  //funcion para cambiar cambiar la barra de herramientas Pdfs
  changeStylesPdfs() {
    const element = this.e?.target as HTMLElement;

    //obtenemos el elemento padre
    const parentElement = element.parentElement;
    const raiz =
      parentElement?.parentElement?.parentElement?.parentElement?.parentElement;



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

    if (element.classList.contains('panel-i')) {
      const idPdf = element.childNodes[2] as HTMLElement;
      //
      element.remove();
      this.panelItems = this.panelItems.filter(
        (item) => item.id != Number(idPdf.id)
      );
      console.log('eliminado archivos', {
        file: this.panelItems,
        elemento: element,
      });
      //desaparece la barra de herramientas
      this.IsVidActive = false;
    } else {
      if (element.parentElement) {
        element.parentElement.remove();
        this.panelItems = this.panelItems.filter(
          (item) => item.id != Number(element.id)
        );
        console.log('eliminado archivos', {
          file: this.panelItems,
          elemento: element,
        });
      }

      //desaparece la barra de herramientas
      this.IsVidActive = false;
    }
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

  //captural el idRol
  capturarIdRol(valor: string) {
    this.idRol = valor;


    if (!this.idRol) {
      return;
    }
  }

  capturarStatus(v:boolean){
    console.log('click')
    if(v == true){
      this.editState =false;
    }

  }

  //funcion para enviar los datos
  OnSaveMural() {


    this.editState = true;


    // Esperar a que se establezca idRol usando una Promesa
    const waitForIdRol = new Promise<void>((resolve) => {
      const checkIdRol = () => {
        if (this.idRol) {
          resolve();
        } else {
          setTimeout(checkIdRol, 100); // Revisar cada 100 milisegundos
        }
      };
      checkIdRol();
    });
    waitForIdRol.then(() => {
      if (!this.idRol) {
        return;
      }
      this.editState = false;
      //obtener valores del mural
      const MuralData = this.containerRef.nativeElement;
      //hacemos la captura de la imgen
      let dataUrl: string[] = [];
      html2canvas(MuralData).then((canva) => {
        const textAreas =
          this.containerRef.nativeElement.querySelectorAll('textarea');
        const images = this.containerRef.nativeElement.querySelectorAll('img');
        const videos =
          this.containerRef.nativeElement.querySelectorAll('video');
        const pdfs =
          this.containerRef.nativeElement.querySelectorAll('pdf-viewer');
        //copia del array con los archivos subidos en el mural separados por tipo
        let imgArray: PanelItem[] = [];
        let videoArray: PanelItem[] = [];
        let pdfArray: PanelItem[] = [];

        this.panelItems.forEach((item) => {
          if (item.type == 'image/jpeg' || item.type == 'image/png') {
            imgArray.push(item);
          }
          if (item.type == 'video/mp4') {
            videoArray.push(item);
          }
          if (item.type == 'application/pdf') {
            pdfArray.push(item);
          }
        });
        //Array de cada elemento

        const Videos: VideoDatasetItem[] = [];
        const Texts: TextDatasetItem[] = [];
        const DataImagenes: ImageDatasetItem[] = [];
        const DataPdfs: PdfsItem[] = [];

        // Recorrer los textAreas y obtener sus valores
        textAreas.forEach((textArea: HTMLTextAreaElement) => {
          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;

          const computedStyle = textArea as HTMLElement;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;
          const cp = textArea;
          const nx = cp.getBoundingClientRect().left - padreX;
          const ny = cp.getBoundingClientRect().top - padreY;
          const { x, y, height, width } = computedStyle.getBoundingClientRect();
          //convertir las posiciones en porcentajes

          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            nx,
            ny
          );


          const valueTexts: TextDatasetItem = {
            id_mural: localStorage.getItem('id_mural'),
            valor: textArea.value,
            font:
              textArea.style.fontFamily == ''
                ? 'Arial'
                : textArea.style.fontFamily,
            font_size:
              textArea.style.fontSize == '' ? '16px' : textArea.style.fontSize,
            posx: /*textArea.offsetLeft*/ Number(left),
            posy: /*textArea.offsetTop*/ Number(top),
            height: Number.isNaN(parseInt(textArea.style.height))
              ? 200
              : parseInt(textArea.style.height),
            width: Number.isNaN(parseInt(textArea.style.width))
              ? 200
              : parseInt(textArea.style.width),
            color:
              !textArea.style.color || textArea.style.color === 'black'
                ? 'rgb(0,0,0)'
                : textArea.style.color,
            border_color:
              !textArea.style.borderColor ||
              textArea.style.borderColor == 'black'
                ? 'rgb(0,0,0)'
                : textArea.style.borderColor,
            border_radius:
              textArea.style.borderRadius == ''
                ? '0%'
                : textArea.style.borderRadius,
            backgroundcolor:
              !textArea.style.backgroundColor ||
              textArea.style.backgroundColor == 'black'
                ? 'rgb(0,0,0)'
                : textArea.style.backgroundColor,
            border_style:
              textArea.style.borderStyle == ''
                ? 'solid'
                : textArea.style.borderStyle,
            font_weight: textArea.style.fontWeight || 'bolder',
            sangria:
              textArea.style.textAlign == ''
                ? 'center'
                : textArea.style.textAlign,
          };

          Texts.push(valueTexts);
        });

        // Recorrer las imágenes y obtener sus atributos o valores
        images.forEach((image: HTMLImageElement, i: number) => {
          const panelItem = imgArray[i];
          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;

          const rect = image.getBoundingClientRect();
          const X = rect.left - padreX;
          const Y = rect.top - padreY;

          const posX = rect.left;
          const posY = rect.top;
          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            X,
            Y
          );


          const valueImages: ImageDatasetItem = {
            id_mural: localStorage.getItem('id_mural'),

            url: panelItem.url,
            alt: image.alt,
            height: image.height,
            width: image.width,
            posx: Number(left),
            posy: Number(top),
            border_color:
              !image.parentElement!.style.borderColor ||
              image.parentElement!.style.borderColor == 'black'
                ? 'rgb(0,0,0)'
                : image.parentElement!.style.borderColor,
            border_radius:
              image.parentElement!.style.borderRadius == ''
                ? '1%'
                : image.parentElement!.style.borderRadius,
            border_style:
              image.parentElement!.style.borderStyle == ''
                ? 'solid'
                : image.parentElement!.style.borderStyle,
          };
          DataImagenes.push(valueImages);
        });

        // Recorrer los videos y obtener sus atributos o valores
        videos.forEach((video: HTMLVideoElement, i: number) => {
          const panelItem = videoArray[i];

          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;

          const rect = video.getBoundingClientRect();
          const X = rect.left - padreX;
          const Y = rect.top - padreY;

          const posX = rect.left;
          const posY = rect.top;
          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            X,
            Y
          );


          const DataVideo: VideoDatasetItem = {
            id_mural: localStorage.getItem('id_mural'),
            url_video: panelItem.url,
            height: video.offsetHeight,
            width: video.offsetWidth,
            posx: Number(left),
            posy: Number(top),
            formato: 'mp4',
            duration: video.duration,
            border_color:
              !video.parentElement!.style.borderColor ||
              video.parentElement!.style.borderColor == 'black'
                ? 'rgb(0,0,0)'
                : video.parentElement!.style.borderColor,
            border_radius:
              video.parentElement!.style.borderRadius == ''
                ? '0%'
                : video.parentElement!.style.borderRadius,
            border_style:
              video.parentElement!.style.borderStyle == ''
                ? 'solid'
                : video.parentElement!.style.borderStyle,
          };

          Videos.push(DataVideo);
        });

        // Se recorre los pdfViewer y se almacena sus valores en un objeto

        pdfs.forEach((pdf: PDFSource, i: number) => {
          //para obtener la posX  y en Y

          const computedStyle = pdf as HTMLElement;
          const { x, y, height, width } = computedStyle.getBoundingClientRect();

          const panelItem = pdfArray[i];

          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;

          const rect = computedStyle.getBoundingClientRect();
          const X = rect.left - padreX;
          const Y = rect.top - padreY;

          // const posX = rect.left;
          // const posY = rect.top;
          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            X,
            Y
          );


          const DataPdf: PdfsItem = {
            id_mural: localStorage.getItem('id_mural'),
            url_pdfs: panelItem.url,
            height: height,
            width: width,
            posx: Number(left),
            posy: Number(top),
            border_color:
              !computedStyle.parentElement!.style.borderColor ||
              computedStyle.parentElement!.style.borderColor == 'black'
                ? 'rgb(0,0,0)'
                : computedStyle.parentElement!.style.borderColor,
            border_style:
              computedStyle.parentElement!.style.borderStyle == ''
                ? 'solid'
                : computedStyle.parentElement!.style.borderStyle,
            border_radius:
              computedStyle.parentElement!.style.borderRadius == ''
                ? '1%'
                : computedStyle.parentElement!.style.borderRadius,
          };
          DataPdfs.push(DataPdf);
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
        let nombreMural = this.MuralnameForm.controls['Muralname'].value;
        //verificamos si se le puso nombre al mural
        if (!nombreMural) {
          nombreMural = 'sin nombre';
        }

        //hacemos una captura del mural para usar en un dashbaord

        const Url = canva.toDataURL('image/png');
        dataUrl.push(Url);
        // const downloadLink = document.createElement('a');
        // downloadLink.href = dataUrl;
        // downloadLink.download = 'captured_image.png'; // Nombre del archivo de descarga
        // downloadLink.click();
        this.isactive = true;
        this.DataMural = {
          id_mural: localStorage.getItem('id_mural'),
          id_user: localStorage.getItem('id_user'),
          editor: this.idRol,
          imgMural: dataUrl[0]!,
          nombrem: nombreMural!,
          height: MuralData.offsetWidth,
          width: MuralData.offsetHeight,
          textos: Texts,
          imagenes: DataImagenes,
          videos: Videos,
          pdfs: DataPdfs,
          estado: 'en espera',
        };


        this.enEspera = true;
        this.mService.postData(this.DataMural).subscribe((data) => {

          this.exito = !this.exito;
          this.enEspera = false;
          setTimeout(() => {
            this.exito = !this.exito;
            this.isactive = false;
          }, 2000);
          this.ruta.navigate(['/main/dashboard']);
        },
        (error) => {
          console.error('Hola', error.status);
          // Puedes agregar lógica adicional de manejo de errores aquí si es necesario
          if(error.status == 0){
            this.exito = true;
            this.enEspera = false;
            this.isactive = false;
            setTimeout(()=> {
              this.ruta.navigate(['/main/dashboard']);
            },1000)

          }else{
            this.isactive = false;
            return;
          }
        });
      });
    });
  }

  //boton para ocultar
  ocultarToolbarTxt() {
    this.isActive = !this.isActive;
  }

  ocultarToolbarMulti() {
    this.IsVidActive = !this.IsVidActive;
  }

  ocultarToolbarPdf() {
    this.isPdfActive = !this.isPdfActive;
  }
  //para convertir la posicion x y y en porcentaje de 50 a 100
  calcularPorcentajeLeftTop(
    padreWidth: number,
    padreHeight: number,
    hijoPosX: number,
    hijoPosY: number
  ): { left: string; top: string } {
    // Calcula el porcentaje de left y top en relación con el padre
    const left = ((hijoPosX / padreWidth) * 100).toFixed(2);
    const top = ((hijoPosY / padreHeight) * 100).toFixed(2);

    return { left, top };
  }

  /*Metodos a futura implementacion */
  // Método para aumentar el zoom
  zoomIn() {
    if (this.zoomLevel > 399) {
      return;
    }
    this.zoomLevel += 10; // Aumenta el zoom en un 10% (puedes ajustarlo).
  }

  // Método para reducir el zoom
  zoomOut() {
    if (this.zoomLevel < 1) {
      return;
    }
    this.zoomLevel -= 10; // Reduce el zoom en un 10% (puedes ajustarlo).
  }
  zoomClear() {
    this.zoomLevel = 100;
  }
}
