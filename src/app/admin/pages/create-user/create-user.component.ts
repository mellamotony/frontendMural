import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  // Ejemplo de uso
  public hijoPosX = 248;
  public hijoPosY = 277;
  public left = '';
  public top = '';
  colors: string[] = ['red', 'blue', 'white'];
  coloRandom: string = '';
  ngOnInit(): void {
    const idRadom = Math.floor(Math.random() * this.colors.length);
    this.coloRandom = this.colors[idRadom];
    const padreWidth = 790;
    const padreHeight = 450;
    const left2 = 777;
    const top2 = 265;
    const { left, top } = this.calcularPorcentajeLeftTop(
      padreWidth,
      padreHeight,
      this.hijoPosX,
      this.hijoPosY
    );
    console.log('Left:', left, 'Top:', top);
    (this.left = left), (this.top = top);

    const lef2 = this.calcularPorcentajeLeftTop(
      padreHeight,
      padreWidth,
      left2,
      top2
    );
    console.log(lef2);
  }

  calcularPorcentajeLeftTop(
    padreWidth: number,
    padreHeight: number,
    hijoPosX: number,
    hijoPosY: number
  ): { left: string; top: string } {
    // Calcula el porcentaje de left y top en relación con el padre
    const left = ((hijoPosX / padreWidth) * 100).toFixed(2) + '%';
    const top = ((hijoPosY / padreHeight) * 100).toFixed(2) + '%';

    return { left, top };
  }
}
