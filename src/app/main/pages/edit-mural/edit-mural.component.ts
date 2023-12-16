import {
  CdkDragDrop,
  CdkDragEnter,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';
import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { PDFSource, PdfViewerComponent } from 'ng2-pdf-viewer';
import { MegaMenuItem, Message } from 'primeng/api';
import {
  ImageDatasetItem,
  MuralDataSetItem,
  PanelItem,
  PdfsItem,
  TextDatasetItem,
  VideoDatasetItem,
  editors,
} from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';
import { environment } from 'src/enviroments/enviroments';

@Component({
  selector: 'app-edit-mural',
  templateUrl: './edit-mural.component.html',
  styleUrls: ['./edit-mural.component.css'],
})
export class EditMuralComponent implements OnInit {
  @ViewChild('prueba') ContainerPrueba!: ElementRef<HTMLElement>;

  @ViewChildren(PdfViewerComponent) pdfViewers!: QueryList<PdfViewerComponent>;

  //variable para manejar el bloqueo de clicks
  public enEspera: boolean = false;

  //Array para almacenar todos los datos del mural
  public IdMural: string = '';

  //variable para activar desactivar el spinner
  public isactive: boolean = true;

  //manejador de zoom variables
  zoomLevel: number = 100; // Inicialmente, sin zoom (100%).

  private DataMural?: MuralDataSetItem;

  // Variables para almacenar el texto por defecto de textArea
  valueInputs: TextDatasetItem[] = [];

  items: MegaMenuItem[] = [];
  //variables para mostrar mensajes
  exito: boolean = false;
  messages: Message[] = [
    {
      severity: 'success',
      summary: 'Success',
      detail: 'Mural actualizado con éxito',
    },
  ];
  //id para los elementos multimedia
  public id: number = 0;

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
  //id para usar
  public idTxt: string[] = [];
  public idImg: string[] = [];
  public idPdf: string[] = [];
  public idVideo: string[] = [];
  private idMural: string = '';
  private idUser: string = '';

  images: string[] = [];

  panelItems: PanelItem[] = [];

  //variable para almacenar usuarios
  public users: editors[] = [];
  //variable para estado del modal
  public editState: boolean = false;
  //variable para el valor del idRol
  public idRol: string = '';

  @ViewChild('contPanel') containerRef!: ElementRef<HTMLElement>;
  herramientaActive:boolean = false;
  constructor(
    private ruta: Router,
    private mService: MuralService,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
    this.renderer = renderer;
  }

  cleanPath(inputPath: string): string {
    const url = environment.apiUrl;
    // Reemplaza "C:\\wamp64\\www\\codeigniter4-framework-5d3d4b2" con "http" en la cadena de entrada.
    const cleanedPath = inputPath.replace(
      /C:\\wamp64\\www\\codeigniter4-framework-5d3d4b2/g,
      url
    );

    return cleanedPath;
  }

  quitslash(cadena: string): string {
    // Utiliza la función replace para reemplazar todas las barras invertidas dobles por barras diagonales normales
    const cremplazada = cadena.replace(/\\\\/g, '/');

    return cremplazada;
  }

  ngOnInit(): void {

    this.herramientaActive = true;
    //Funcion que limpia el C:\\wamp\www\codeigniter

    let nombreMural: string = '';
    this.activateRoute.paramMap.subscribe((params) => {
      const idMural: string = params.get('id')!;
      this.idMural = idMural;

      this.mService.postIdmurl(idMural).subscribe((mural) => {

        this.isactive = false;
        this.idUser = mural[0].id_user!;
        //ingresando nombre del mural
        nombreMural = mural[0].nombrem!;
        this.MuralnameForm.controls['Muralname'].setValue(nombreMural);
        //ingresando los textos

        mural[0].textos.forEach((data) => {
          //const {backgroundcolor,border_radius,border_color,border_style,color,font,font_size,font_weight,height,width,id_mural,posx,posy,sangria,valor} = data
          data.posx = Number(data.posx);
          data.posy = Number(data.posy);
          this.valueInputs.push(data);

          this.idTxt.push(data.id_txt!);
        });

        //capturando los datos para imagenes
        mural[0].imagenes.forEach((data) => {

          const arraytype = data.url.split('.');
          const type = arraytype[1];

          const datas: PanelItem = {
            file: {
              lastModified: 0,
              name: data.alt,
              size: 1,
              type: 'image/' + type,
            } as File,
            url: this.cleanPath(data.url),
            type: 'image/' + type,
            border_style: data.border_style,
            border_radius: data.border_radius,
            border_color: data.border_color,
            posx: Number(data.posx),
            posy: Number(data.posy),
            height: Number(data.height),
            width: Number(data.width),
            id: Number(data.id_imagenes),
          };
          this.idImg.push(data.id_imagenes!);

          this.panelItems.push(datas);
        });

        //capturando los videos
        mural[0].videos.forEach((data) => {
          const arraytype = data.url_video.split('.');
          const type = arraytype[1];

          let datas: PanelItem = {
            file: {
              lastModified: 0,
              name: '',
              size: 1,
              type: 'video/' + type,
            } as File,
            url: this.quitslash(this.cleanPath(data.url_video)),
            type: 'video/' + type,
            border_style: data.border_style,
            border_radius: data.border_radius,
            border_color: data.border_color,
            posx: Number(data.posx),
            posy: Number(data.posy),
            height: Number(data.height),
            width: Number(data.width),
            id: Number(data.id_video),
          };

          this.idVideo.push(data.id_video!);
          this.panelItems.push(datas);
        });

        //capturando los pdfs
        mural[0].pdfs.forEach((data) => {
          const urls = this.cleanPath(data.url_pdfs!);
          const urlLImpia = this.quitslash(urls);

          const arraytype = data.url_pdfs!.split('.');
          const type = arraytype[1];
          let datas: PanelItem = {
            file: {
              lastModified: 0,
              name: '',
              size: 1,
              type: 'application/' + type,
            } as File,
            url: urlLImpia,
            type: 'application/' + type,
            border_style: data.border_style,
            border_radius: data.border_radius,
            border_color: data.border_color,
            posx: Number(data.posx),
            posy: Number(data.posy),
            height: Number(data.height),
            width: Number(data.width),
            id: Number(data.id_pdfs),
          };
          this.idPdf.push(data.id_pdfs!);

          this.panelItems.push(datas);

        });
      });
    });

    //elimina si es editor el guardar como nuevo
    const esEditor = localStorage.getItem('rol');
    if (esEditor == 'editor') {
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
          label: 'Guardar/Enviar solicitud',
          icon: 'pi pi-fw pi-save',
          items: [
            [
              {
                items: [
                  {
                    label: 'Guardar cambios',
                    icon: 'pi pi-fw pi-save',
                    command: () => {
                      this.OnSaveMural();
                    },
                  },
                ],
              },
            ],
          ],
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
        // },
      ];
    } else {
      //si no es un diseñador
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
          label: 'Guardar/Enviar solicitud',
          icon: 'pi pi-fw pi-save',
          items: [
            [
              {
                items: [
                  {
                    label: 'Guardar cambios',
                    icon: 'pi pi-fw pi-save',
                    command: () => {
                      this.OnSaveMural();
                    },
                  },
                  {
                    label: 'Guardar como nuevo',
                    icon: 'pi pi-fw pi-save',
                    command: () => {
                      this.OnSaveMuralAsNew();
                    },
                  },
                ],
              },
            ],
          ],
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
        // },
      ];
    }

    //cargar los editores para elmodal
    this.mService.getUsers().subscribe((data) => {
      data.map((dat) => {
        if (dat.rol == 'editor') {
          this.users.push(dat);
        }
      });

    });
  }

  ngAfterViewInit(): void {

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
    const txt: TextDatasetItem = {
      id_mural: '',
      valor: 'Ingrese el texto',
      font: '',
      font_size: '',
      posx: 10,
      posy: 10,
      height: 100,
      width: 200,
      color: '',
      border_color: 'rgb(0, 0, 0)',
      border_radius: '',
      border_style: '',
      backgroundcolor: '',
      font_weight: '',
      sangria: 'center',
    };
    this.valueInputs.push(txt);

  }
  //Crear archivos
  createFileInput() {
    const divContainer = document.createElement('div');
  }

  handleFileInput(event: any): void {
    const files: File[] = Array.from(event.target.files);

    const maxSizeInBytes = 10485760;
    if (files[0].size < 0) {
      return;
    }
    if (files[0].size > maxSizeInBytes) {
      this.exito = true;
      this.messages.pop();
      this.messages.push({
        severity: 'error',
        detail: 'No debe superar el tamaño máximo de 10MB',
      });
      setTimeout(() => {
        this.exito = false;
      }, 3000);
      const fileInput: HTMLInputElement = event.target;
      fileInput.value = '';
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const item: PanelItem = {
          file: file,
          type: file.type,
          url: e.target?.result as string,
          id: this.panelItems.length + 1 == 0 ? 1 : this.panelItems.length + 1,
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
    this.herramientaActive = false;
    this.IsVidActive = false;
    if ((this.isPdfActive = true)) {
      this.isPdfActive = false;
    }

    const element = e.target as HTMLElement;

    this.isActive = true;

    this.e = e;
    const elemento = e.target as HTMLElement
    const color = this.eliminarUnidades(elemento.style.color) == '' ? 'rgb(0,0,0)': this.eliminarUnidades(elemento.style.color)
    const background_color = this.eliminarUnidades(elemento.style.backgroundColor) == '' ||'black' ? 'rgb(255,255,255)': this.eliminarUnidades(elemento.style.color)
    const border_color = this.eliminarUnidades(elemento.style.borderColor) == '' ? 'rgb(0,0,0)': this.eliminarUnidades(elemento.style.borderColor)



    this.toolsForm.controls['height'].setValue(parseInt(this.eliminarUnidades(elemento.style.height)));
    this.toolsForm.controls['width'].setValue(parseInt(this.eliminarUnidades(elemento.style.width)));
    this.toolsForm.controls['color'].setValue(this.rgbToHex(color));
    this.toolsForm.controls['fonts'].setValue((this.eliminarUnidades(elemento.style.fontFamily)));
    this.toolsForm.controls['borderStyle'].setValue((this.eliminarUnidades(elemento.style.borderStyle)));
    this.toolsForm.controls['borderRadius'].setValue(parseInt(this.eliminarUnidades(elemento.style.borderRadius)));
    this.toolsForm.controls['alignment'].setValue((this.eliminarUnidades(elemento.style.textAlign)));
    this.toolsForm.controls['fontSize'].setValue(parseInt(this.eliminarUnidades(elemento.style.fontSize)));
    this.toolsForm.controls['borderColor'].setValue(this.rgbToHex(border_color));
    this.toolsForm.controls['background'].setValue(this.rgbToHex(background_color));
  }
    //permite tener los estilos en la barra de herramientas
    mantenerStilos(e:MouseEvent){
      const elemento = e.target as HTMLElement
      if(elemento.classList.contains('panel-i')){
      const border_color = this.eliminarUnidades(elemento.style.borderColor) == '' ? 'rgb(0,0,0)': this.eliminarUnidades(elemento.style.borderColor)

      this.toolsForm.controls['borderColor'].setValue(this.rgbToHex(border_color));
      this.toolsForm.controls['height'].setValue(parseInt(this.eliminarUnidades(elemento.style.height)));
      this.toolsForm.controls['width'].setValue(parseInt(this.eliminarUnidades(elemento.style.width)));
      this.toolsForm.controls['borderRadius'].setValue(parseInt(this.eliminarUnidades(elemento.style.borderRadius)));
      this.toolsForm.controls['borderStyle'].setValue((this.eliminarUnidades(elemento.style.borderStyle)));
      return
    }
      const ePadre = elemento.parentElement
      const border_color = this.eliminarUnidades(ePadre!.style.borderColor) == '' ? 'rgb(0,0,0)': this.eliminarUnidades(ePadre!.style.borderColor);

      this.toolsForm.controls['borderColor'].setValue(this.rgbToHex(border_color));
      this.toolsForm.controls['height'].setValue(parseInt(this.eliminarUnidades(ePadre!.style.height)));
      this.toolsForm.controls['width'].setValue(parseInt(this.eliminarUnidades(ePadre!.style.width)));
      this.toolsForm.controls['borderRadius'].setValue(parseInt(this.eliminarUnidades(ePadre!.style.borderRadius)));
      this.toolsForm.controls['borderStyle'].setValue((this.eliminarUnidades(ePadre!.style.borderStyle)));
    }
    //cambiar formato
    rgbToHex(rgbString: string): string | null {
      const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

      if (!match) {
        return null; // Devuelve null si el formato del string RGB no es válido
      }

      const [, r, g, b] = match.map(Number);

      const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      const hexR = toHex(r);
      const hexG = toHex(g);
      const hexB = toHex(b);

      return `#${hexR}${hexG}${hexB}`;
    }
    //funcion que limpia los px y / de un texto
     eliminarUnidades(cadena: string): string {
      // Eliminar "px"
      const sinPx = cadena.replace("px", "");

      // Eliminar "/"
      const sinSlash = sinPx.replace("/", "");
      const sincomi = sinSlash.replaceAll('"',"")

      return sincomi;
    }

  //click a los elementos de video,pdf e imagenes
  handleClickMultimedia(e: MouseEvent) {
    this.herramientaActive = false;
    // const newElement = e.target as HTMLElement;
    // this.isActive = false;
    // if (this.isPdfActive = true) {
    //   this.isPdfActive = false;

    // }
    //
    // console.log(this.e)

    // if (newElement.className == 'textLayer') {
    //   console.log('textlayer')
    //   this.isPdfActive = true;
    //   this.IsVidActive = false;
    //   this.e = e;
    //   return;
    // }
    // //si se cumple quiere decir que es video o imagen
    // if (newElement.className == 'ng-star-inserted') {
    //   this.IsVidActive = true;
    // }

    // this.e = e;

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
    this.mantenerStilos(e);
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

  //borrar cualquier elemento
  DeleteElement() {
    const element = this.e?.target as HTMLElement;

    element.remove();
    //desaparece la barra de herramientas
    this.isActive = false;
  }
  //borrar el elemento padre
  DeleteParent() {
    // const element = this.e?.target as HTMLElement;
    // console.log('eliminado de elementos')
    // ##
    // if (element.parentElement) {
    //   element.parentElement.remove();
    // }

    // //desaparece la barra de herramientas
    // this.IsVidActive = false;
    const element = this.e?.target as HTMLElement;

    if (element.classList.contains('panel-i')) {

      const idPdf = element.childNodes[2] as HTMLElement;
      element.remove();
      this.panelItems = this.panelItems.filter(
        (item) => item.id != Number(idPdf.id)
      );
      this.idPdf = this.idPdf.filter((id) => Number(id) != Number(element.id));

      //desaparece la barra de herramientas
      this.IsVidActive = false;
    } else {
      if (element.parentElement) {

        element.parentElement.remove();
        this.panelItems = this.panelItems.filter(
          (item) => item.id != Number(element.id)
        );
        //se eliminan los id de los array que se llenaron al hacer el ngOnit
        if (element.nodeName == 'IMG') {
          this.idImg = this.idImg.filter(
            (id) => Number(id) != Number(element.id)
          );

        } else {
          this.idVideo = this.idVideo.filter(
            (id) => Number(id) != Number(element.id)
          );

        }
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
    this.isPdfActive = false;
  }

  //captural el idRol
  capturarIdRol(valor: string) {
    this.isactive = false;
    this.idRol = valor;


    if (!this.idRol) {
      return;
    }
  }

  salirModal(v: boolean) {
    if (v == true) {
      this.editState = false;
    }
  }

  //funcion para enviar los datos y actualizar los datos
  OnSaveMural() {
    this.isActive = false;
    this.IsVidActive = false;
    //obtener valores del mural
    const MuralData = this.containerRef.nativeElement;
    //copia del array con los archivos subidos en el mural separados por tipo
    let imgArray: PanelItem[] = [];
    let videoArray: PanelItem[] = [];
    let pdfArray: PanelItem[] = [];

    //this.editState = true;
    // Esperar a que se establezca idRol usando una Promesa
    // const waitForIdRol = new Promise<void>((resolve) => {
    //   const checkIdRol = () => {
    //     if (this.idRol) {
    //       resolve();
    //     } else {
    //       setTimeout(checkIdRol, 100); // Revisar cada 100 milisegundos
    //     }
    //   };
    //   checkIdRol();
    // });
    //waitForIdRol.then(() => {

    // if (!this.idRol) {
    //   return;
    // }
    this.editState = false;
    this.panelItems.forEach((item) => {

      if (
        item.type == 'image/jpeg' ||
        item.type == 'image/png' ||
        item.type == 'image/jpg' ||
        item.type == 'image/cloudinary'
      ) {
        imgArray.push(item);

      }
      if (item.type == 'video/mp4' || item.type == 'video/cloudinary') {
        videoArray.push(item);
      }
      if (
        item.type == 'application/pdf' ||
        item.type == 'application/cloudinary'
      ) {
        pdfArray.push(item);

      }
    });

    //hacemos la captura de la imgen
    let dataUrl: string[] = [];
    html2canvas(MuralData).then((canva) => {
      const textAreas =
        this.containerRef.nativeElement.querySelectorAll('textarea');
      const images = this.containerRef.nativeElement.querySelectorAll('img');
      const videos = this.containerRef.nativeElement.querySelectorAll('video');
      const pdfs =
        this.containerRef.nativeElement.querySelectorAll('pdf-viewer');

      //Array de cada elemento

      const Videos: VideoDatasetItem[] = [];
      const Texts: TextDatasetItem[] = [];
      const DataImagenes: ImageDatasetItem[] = [];
      const DataPdfs: PdfsItem[] = [];

      // Recorrer los textAreas y obtener sus valores
      textAreas.forEach((textArea: HTMLTextAreaElement) => {
        const computedStyle = textArea as HTMLElement;
        const { x, y, height, width } = computedStyle.getBoundingClientRect();
        const padreW = MuralData.clientWidth;
        const padreH = MuralData.clientHeight;
        const padreX = MuralData.getBoundingClientRect().left;
        const padreY = MuralData.getBoundingClientRect().top;
        const nx = textArea.getBoundingClientRect().left - padreX;
        const ny = textArea.getBoundingClientRect().top - padreY;
        const { left, top } = this.calcularPorcentajeLeftTop(
          padreW,
          padreH,
          nx,
          ny
        );


        const valueTexts: TextDatasetItem = {
          id_mural: this.idMural,
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
            !textArea.style.borderColor || textArea.style.borderColor == 'black'
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
          id_txt: textArea.id !== undefined ? textArea.id : undefined,
        };
        if (valueTexts.id_txt == 'undefined') {
          delete valueTexts.id_txt;

        }


        Texts.push(valueTexts);
      });

      // Recorrer las imágenes y obtener sus atributos o valores
      images.forEach((image: HTMLImageElement, i: number) => {
        const rect = image.getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;
        const padreW = MuralData.clientWidth;
        const padreH = MuralData.clientHeight;
        const padreX = MuralData.getBoundingClientRect().left;
        const padreY = MuralData.getBoundingClientRect().top;
        const X = rect.left - padreX;
        const Y = rect.top - padreY;

        const { left, top } = this.calcularPorcentajeLeftTop(
          padreW,
          padreH,
          X,
          Y
        );

        const panelItem = imgArray[i];
        const computedStyle = image as HTMLElement;
        // const { x, y, height, width } = computedStyle.getBoundingClientRect()
        if (panelItem) {

        } else {
          console.error(`imgArray[${i}] es undefined.`);
        }

        const valueImages: ImageDatasetItem = {
          id_mural: this.idMural,
          id_imagenes: this.idImg[i] !== undefined ? this.idImg[i] : undefined,
          url: panelItem.url! == undefined ? 'ojo' : panelItem.url,
          alt: image.alt,
          height: Number(computedStyle.parentElement?.clientHeight) + 2,
          width: Number(computedStyle.parentElement?.clientWidth) + 2,
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
        if (valueImages.id_imagenes == undefined) {
          delete valueImages.id_imagenes;

        }

        DataImagenes.push(valueImages);
      });

      // Recorrer los videos y obtener sus atributos o valores
      videos.forEach((video: HTMLVideoElement, i: number) => {
        const panelItem = videoArray[i];

        const videoSrc = video.currentSrc;
        const padreW = MuralData.clientWidth;
        const padreH = MuralData.clientHeight;
        const padreX = MuralData.getBoundingClientRect().left;
        const padreY = MuralData.getBoundingClientRect().top;

        const rect = video.getBoundingClientRect();
        const X = rect.left - padreX;
        const Y = rect.top - padreY;

        const { left, top } = this.calcularPorcentajeLeftTop(
          padreW,
          padreH,
          X,
          Y
        );


        const DataVideo: VideoDatasetItem = {
          id_mural: this.idMural,
          url_video: panelItem.url,
          height: video.offsetHeight,
          width: video.offsetWidth,
          posx: Number(left),
          posy: Number(top),
          formato: 'mp4',
          duration: !Number.isNaN(video.duration) ? video.duration : 50,
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
          id_video: this.idVideo[i] !== undefined ? this.idVideo[i] : undefined,
        };
        if (DataVideo.id_video == undefined) {
          delete DataVideo.id_video;

        }
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
          id_mural: this.idMural,
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
          id_pdfs: this.idPdf[i] !== undefined ? this.idPdf[i] : undefined,
        };
        if (DataPdf.id_pdfs == undefined) {
          delete DataPdf.id_pdfs;

        }
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
      //obetenemos la fecha de modificacion actual
      const fecha_actual = new Date();
      const year = fecha_actual.getFullYear();
      const month = (fecha_actual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan desde 0
      const day = fecha_actual.getDate().toString().padStart(2, '0');
      const hours = fecha_actual.getHours().toString().padStart(2, '0');
      const minutes = fecha_actual.getMinutes().toString().padStart(2, '0');
      const seconds = fecha_actual.getSeconds().toString().padStart(2, '0');

      // Formatear la fecha y hora en el formato deseado
      const fechaModificacion = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;


      //hacemos una captura del mural para usar en un dashbaord

      const Url = canva.toDataURL('image/png');
      dataUrl.push(Url);
      //se bloquea los clicks
      this.enEspera = true;

      //se activa el spinner
      this.isactive = true;

      //ordenamos en un objeto todos los datos necesarios para enviar al backend
      this.DataMural = {
        id_mural: this.idMural,
        id_user: localStorage.getItem('id_user'),
        editor: this.idRol,
        nombrem: nombreMural!,
        imgMural: dataUrl[0]!,
        height: MuralData.offsetWidth,
        width: MuralData.offsetHeight,
        fecha_modificacion: fechaModificacion!,
        textos: Texts,
        imagenes: DataImagenes,
        videos: Videos,
        pdfs: DataPdfs,
        estado: 'en espera',
      };


      //Endepoint para actualizar
      this.mService.updateMural(this.DataMural).subscribe((data) => {

        if (data.mensaje) {
          this.enEspera = false;
          this.exito = true;
          this.isactive = false;
          setTimeout(() => {
            this.exito = false;
          }, 2000);
        }
      });
      this.idRol = '';
    });

    //});
  }

  OnSaveMuralAsNew() {
    //activar spinner

    //obtener valores del mural
    //id del nuevo mural
    const id_muraal = uuidv4();
    const MuralData = this.containerRef.nativeElement;
    //copia del array con los archivos subidos en el mural separados por tipo
    let imgArray: PanelItem[] = [];
    let videoArray: PanelItem[] = [];
    let pdfArray: PanelItem[] = [];

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
      this.panelItems.forEach((item) => {

        if (
          item.type == 'image/jpeg' ||
          item.type == 'image/png' ||
          item.type == 'image/jpg' ||
          item.type == 'image/cloudinary'
        ) {
          imgArray.push(item);

        }
        if (item.type == 'video/mp4' || item.type == 'video/cloudinary') {
          videoArray.push(item);
        }
        if (
          item.type == 'application/pdf' ||
          item.type == 'application/cloudinary'
        ) {
          pdfArray.push(item);
        }
      });

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

        //Array de cada elemento

        const Videos: VideoDatasetItem[] = [];
        const Texts: TextDatasetItem[] = [];
        const DataImagenes: ImageDatasetItem[] = [];
        const DataPdfs: PdfsItem[] = [];

        // Recorrer los textAreas y obtener sus valores
        textAreas.forEach((textArea: HTMLTextAreaElement) => {
          const computedStyle = textArea as HTMLElement;
          const { x, y, height, width } = computedStyle.getBoundingClientRect();
          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;
          const nx = textArea.getBoundingClientRect().left - padreX;
          const ny = textArea.getBoundingClientRect().top - padreY;
          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            nx,
            ny
          );


          const valueTexts: TextDatasetItem = {
            id_mural: id_muraal,
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
            id_txt: textArea.id !== undefined ? textArea.id : undefined,
          };
          if (valueTexts.id_txt == 'undefined') {
            delete valueTexts.id_txt;

          }


          Texts.push(valueTexts);
        });

        // Recorrer las imágenes y obtener sus atributos o valores
        images.forEach((image: HTMLImageElement, i: number) => {
          const rect = image.getBoundingClientRect();
          const x = rect.left;
          const y = rect.top;
          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;
          const X = rect.left - padreX;
          const Y = rect.top - padreY;

          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            X,
            Y
          );

          const panelItem = imgArray[i];
          const computedStyle = image as HTMLElement;
          // const { x, y, height, width } = computedStyle.getBoundingClientRect()
          if (panelItem) {

          } else {
            console.error(`imgArray[${i}] es undefined.`);
          }

          const valueImages: ImageDatasetItem = {
            id_mural: id_muraal,
            id_imagenes:
              this.idImg[i] !== undefined ? this.idImg[i] : undefined,
            url: panelItem.url! == undefined ? 'ojo' : panelItem.url,
            alt: image.alt,
            height: Number(computedStyle.parentElement?.clientHeight) + 2,
            width: Number(computedStyle.parentElement?.clientWidth) + 2,
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
          if (valueImages.id_imagenes == undefined) {
            delete valueImages.id_imagenes;

          }

          DataImagenes.push(valueImages);
        });

        // Recorrer los videos y obtener sus atributos o valores
        videos.forEach((video: HTMLVideoElement, i: number) => {
          const panelItem = videoArray[i];

          const videoSrc = video.currentSrc;
          const padreW = MuralData.clientWidth;
          const padreH = MuralData.clientHeight;
          const padreX = MuralData.getBoundingClientRect().left;
          const padreY = MuralData.getBoundingClientRect().top;

          const rect = video.getBoundingClientRect();
          const X = rect.left - padreX;
          const Y = rect.top - padreY;

          const { left, top } = this.calcularPorcentajeLeftTop(
            padreW,
            padreH,
            X,
            Y
          );


          const DataVideo: VideoDatasetItem = {
            id_mural: id_muraal,
            url_video: panelItem.url,
            height: video.offsetHeight,
            width: video.offsetWidth,
            posx: Number(left),
            posy: Number(top),
            formato: 'mp4',
            duration: !Number.isNaN(video.duration) ? video.duration : 50,
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
            id_video:
              this.idVideo[i] !== undefined ? this.idVideo[i] : undefined,
          };
          if (DataVideo.id_video == undefined) {
            delete DataVideo.id_video;

          }
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
            id_mural: id_muraal,
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
            id_pdfs: this.idPdf[i] !== undefined ? this.idPdf[i] : undefined,
          };
          if (DataPdf.id_pdfs == undefined) {
            delete DataPdf.id_pdfs;

          }
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
        //obetenemos la fecha de modificacion actual
        const fecha_actual = new Date();
        const year = fecha_actual.getFullYear();
        const month = (fecha_actual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan desde 0
        const day = fecha_actual.getDate().toString().padStart(2, '0');
        const hours = fecha_actual.getHours().toString().padStart(2, '0');
        const minutes = fecha_actual.getMinutes().toString().padStart(2, '0');
        const seconds = fecha_actual.getSeconds().toString().padStart(2, '0');

        // Formatear la fecha y hora en el formato deseado
        const fechaModificacion = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;


        //hacemos una captura del mural para usar en un dashbaord

        const Url = canva.toDataURL('image/png');
        dataUrl.push(Url);

        this.isactive = true;
        //ordenamos en un objeto todos los datos necesarios para enviar al backend
        this.DataMural = {
          id_mural: id_muraal,
          id_user: this.idUser,
          editor: this.idRol,
          nombrem: nombreMural!,
          imgMural: dataUrl[0]!,
          height: MuralData.offsetWidth,
          width: MuralData.offsetHeight,
          fecha_modificacion: fechaModificacion!,
          textos: Texts,
          imagenes: DataImagenes,
          videos: Videos,
          pdfs: DataPdfs,
          estado: 'en espera',
        };


        this.enEspera = true;
        //Endepoint para actualizar
        this.mService.postData(this.DataMural).subscribe(
          (data) => {

            if (data.mensaje) {
              this.enEspera = false;
              this.exito = true;
              this.isactive = false;
              setTimeout(() => {
                this.exito = false;
              }, 2000);
            }
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
          }
        );
        this.idRol = '';
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

  // Método para aumentar el zoom
  zoomIn() {
    if (this.zoomLevel > 99) {
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
}
