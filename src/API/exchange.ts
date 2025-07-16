import api from "@/lib/axios";
import { Token } from "@/components/ui/combobox";

interface ExchangePayload {
  from: string;
  to: string;
  amount: number;
}

interface ExchangeResponse {
  message: string;
}

interface RatePayload {
    user_id: string,
    symbol_1: string;
    symbol_2: string;
}

interface RateResponse {
    rate: string,
    max: string,
    min: string,
}

interface FeePayload {
    user_id: string,
    symbol_1: string;
    symbol_2: string;
}

interface FeeResponse {
    message: string,
}

interface ConfirmPayload {
    user_id: string,
    receive_addr: string,
    symbol_1: string,
    symbol_2: string,
    in_lots: number,
    out_lots: number,
}

interface ConfirmResponse {
    message: string,
}

interface ListPayload {
    user_id: string,
}

// interface ListResponse {
//     message: Token[],
// }

export const submitExchange = async (payload: ExchangePayload): Promise<ExchangeResponse> => {
  const res = await api.post<ExchangeResponse>("main/exchange", payload);
  return res.data;
};

export const getSymbolList = async (payload: ListPayload): Promise<Token[]> => {
    const res = await api.post<Token[]>("main/symbol_list", payload);
    console.log("respons arrived");
    return res.data;
};

export const getSymbolList_coin = async () => {
    const res = await api.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 20,
                page: 1,
                sparkline: false,
            },
        }
    );
    return res.data.map((coin: any) => ({
        label: coin.symbol.toUpperCase(),
        value: coin.symbol,
        icon: coin.image,
      }))
}

export const getRate = async (payload: RatePayload): Promise<RateResponse> => {
    const res = await api.post<RateResponse>("main/conversion_rate", payload);
    return res.data;
};

export const getFee = async (payload: FeePayload): Promise<FeeResponse> => {
    const res = await api.post<FeeResponse>("main/commission_fee", payload);
    return res.data;
};

export const sendConfirmInfo = async (payload: ConfirmPayload): Promise<ConfirmResponse> => {
    const res = await api.post<ConfirmResponse>("main/start_exchange", payload);
    return res.data;
}

