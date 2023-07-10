import { style } from '@angular/animations';
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
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { PanelItem } from '../../interfaces/mural.interfaces';

@Component({
  selector: 'app-create-mural',
  templateUrl: './create-mural.component.html',
  styleUrls: ['./create-mural.component.css'],
})
export class CreateMuralComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('prueba') ContainerPrueba!: ElementRef<HTMLElement>;

  // Variables para almacenar el texto por defecto de textArea
  valueInputs: string[] = [];

  items: MegaMenuItem[] = [];
  //activeItem: MenuItem = {};
  //variable para validar la aparcion de la herramienta
  isActive:boolean = false;
  //Variables para cambiar estilos del texto
  color:string = ''
  //variable para familias de textos
  public fontFamilies:string[] = [
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
    'Comic Sans MS'
  ];


  //Variable que guarda el elemento actual para la barra de herramientas
  public e?:MouseEvent

  //formularios
  public toolsForm:FormGroup = this.fb.group(
    {
      color:this.fb.control(''),
      width:this.fb.control(''),
      height:this.fb.control(''),
      negrita:this.fb.control(false),
      background:this.fb.control(''),
      alignment:this.fb.control('center'),
      fonts:this.fb.control(''),
      fontSize:this.fb.control('')
    }
  )

  // Declara la propiedad renderer con el tipo Renderer2
  private renderer!: Renderer2;

  images: string[] = [];

  panelItems: PanelItem[] = [];

  @ViewChild('contPanel') containerRef!: ElementRef<HTMLElement>;




  //constructor
  constructor(
    private fb:FormBuilder,
    private elementRef: ElementRef,
    renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
    this.renderer = renderer;
  }
  ngOnDestroy(): void {
    const pt = this.ContainerPrueba.nativeElement;

  }
  ngAfterViewInit(): void {
    console.log('cargado')

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
                { label: 'Tipo:Jpg', command: () => {
                  this.uploadFile('image/jpeg');
                } },
                {
                  label: 'Tipo:Png',
                  command: () => {
                    this.uploadFile('image/png')
                  }
                },
              ],
            },
          ],
          [
            {
              label: 'Video',
              items: [{
                label: 'Tipo:Mp4',
                command: () => {
                  this.uploadFile('video/mp4');
              }
              }],
            },
            {
              label: 'Pdf',
              items: [
                {
                  label: 'Subir',
                  command: () => {
                    alert('click');
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
    alert('click')
    const inputElement: HTMLInputElement | null = document.querySelector('#fileInput');
    if (inputElement) {
      inputElement.accept = acceptedType;
      inputElement.click();
    }
  }



  //click al elemento ContainerTxt
  handleClick(e:MouseEvent) {
    console.log('El elemento fue presionado');
    console.log(e);
    const element = e.target as HTMLElement;

    this.isActive = true;

    this.e = e;



  }


  //funcion para cambiar colores
  getChangesStyles(){

    const element = this.e?.target as HTMLElement;

    element.style.color = this.toolsForm.controls['color'].value;

    element.style.backgroundColor = this.toolsForm.controls['background'].value;

    element.style.width = this.toolsForm.controls['width'].value+'px';

    element.style.height = this.toolsForm.controls['height'].value+'px';


    if(this.toolsForm.controls['negrita'].value === true ){
      element.style.fontWeight = "bolder";
    }

    element.style.textAlign = this.toolsForm.controls['alignment'].value;

    element.style.fontFamily = this.toolsForm.controls['fonts'].value;

    element.style.fontSize =  this.toolsForm.controls['fontSize'].value + 'px';
    this.isActive = false;
  }

}
