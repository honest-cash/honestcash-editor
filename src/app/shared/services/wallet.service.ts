import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

export interface ICurrencyConversion {
  usd: number;
  bch: number;
}

export interface ICurrencyRate {
  USD: string;
}

export interface ICurrencyConversionResponse {
  data: {
    rates: ICurrencyRate;
  };
}

const routes = {
  convertCurrency: () => `https://api.coinbase.com/v2/exchange-rates?currency=BCH`
};

@Injectable()
export class WalletService {
  constructor(private httpClient: HttpClient) {}

  getCurrencyData(): Observable<ICurrencyConversionResponse> {
    return this.httpClient.get<ICurrencyConversionResponse>(routes.convertCurrency());
  }

  convertBCHtoUSD(bch: number, rate: number): number {
    return Number((rate * bch).toFixed(2));
  }

  convertUSDtoBCH(usd: number, rate: number): number {
    return Number(((1 / rate) * usd).toFixed(4));
  }
}
