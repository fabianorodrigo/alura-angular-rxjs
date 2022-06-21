import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { merge, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

const ESPERA_DIGITACAO_MS = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent implements OnInit, OnDestroy {
  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes();
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    //só repassado o fluxo após um tempo
    debounceTime(ESPERA_DIGITACAO_MS),
    // loga o  elemento
    tap(console.log),
    // só repassa o fluxo se atender à condição
    filter((v) => v.length >= 3 || !v.length),
    distinctUntilChanged(),
    // redireciona o fluxo para um outro observable
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado))
  );
  acoes: Acoes;
  private subcription: Subscription;
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) {}

  ngOnInit(): void {
    this.subcription = this.acoesService
      .getAcoes()
      .subscribe((acoesOrdenadas: Acoes) => {
        this.acoes = acoesOrdenadas;
      });
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
