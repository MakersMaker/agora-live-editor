import * as React from 'react';

interface OptionsHistoryItemAPI {
  chain_symbol: string;
  side: 'long' | 'short';
  type: 'call' | 'put';
  quantity: string;
  average_price: string;
  options: string;
  strike_price: string;
  expiration_date: string;
  state: 'active' | 'expired';
  created_at: string;
}

interface OrderHistoryItemAPI {
  side: 'buy' | 'sell';
  instrument: string;
  quantity: string;
  average_price: string;
  last_transaction_at: string;
  name: string;
  symbol: string;
  country: string;
  url: string;
}

interface TradeRecord {
  quantity: number;
  average_price: number;
  side: 'buy' | 'sell';
  last_transaction_at: Date;
  symbol: string;
  [key: string]: any;
}

interface TradingHistoryStates {
  orders: TradeRecord[];
  options: TradeRecord[];
}

interface TradingHistoryProps {}

class TradingHistory extends React.Component<TradingHistoryProps, TradingHistoryStates> {
  state: TradingHistoryStates = {
    orders: [],
    options: [],
  }

  async componentDidMount() {
    const portfolioRepsonse = await fetch('http://localhost:3000/portfolio');
    const portfolio = await portfolioRepsonse.json();

    // console.table(portfolio.orders);
    console.table(portfolio.options);
    this.setState({
      orders: this.convertOrderHistoryToTradeRecords(portfolio.orders),
      options: this.convertOptionsTradeHistoryToTradeRecords(portfolio.options)
    });
  }

  render() {
    return (<>
      <h1>Orders</h1>
      <TradingRecords records={ this.state.orders }></TradingRecords>
      <h1>Options</h1>
      <TradingRecords records={ this.state.options }></TradingRecords>
    </>);
  }

  convertOptionsTradeHistoryToTradeRecords(rawData: OptionsHistoryItemAPI[]): TradeRecord[] {
    if (!rawData.length) return [];

    const optionsSide: { [key: string]: TradeRecord['side'] } = { long: 'buy', short: 'sell' };

    return rawData.map(rawDatum => ({
      quantity: parseInt(rawDatum.quantity),
      average_price: parseFloat(rawDatum.average_price),
      side: optionsSide[rawDatum.side],
      last_transaction_at: new Date(rawDatum.created_at),
      symbol: rawDatum.chain_symbol,
    }));
  }

  convertOrderHistoryToTradeRecords(rawData: OrderHistoryItemAPI[]): TradeRecord[] {
    if (!rawData.length) return [];

    return rawData.map(rawDatum => ({
      quantity: parseInt(rawDatum.quantity),
      average_price: parseFloat(rawDatum.average_price),
      side: rawDatum.side,
      last_transaction_at: new Date(rawDatum.last_transaction_at),
      symbol: rawDatum.symbol,
    }));
  }

  getRecordsOfSymbol(records: TradeRecord[], symbol: string): TradeRecord[] {
    if (!records.length) return [];
    return records.filter(record => record.symbol === symbol);
  }
}

export default TradingHistory;

interface TradingRecordsProps {
  records: TradeRecord[];
}

class TradingRecords extends React.PureComponent<TradingRecordsProps> {
  render() {
    if (!this.props.records.length) return <></>;

    const tableBody = this.props.records.map(record => <tr key={ record.last_transaction_at.valueOf() }>
      <td>{ record.last_transaction_at.toLocaleDateString() }</td>
      <td>{ record.symbol }</td>
      <td>{ record.side }</td>
      <td>{ record.average_price }</td>
      <td>{ record.quantity }</td>
    </tr>);

    return <table>
      <thead>
        <th>Transaction Date</th>
        <th>Symbol</th>
        <th>Side</th>
        <th>Average Price</th>
        <th>Quantity</th>
      </thead>
      <tbody>{ tableBody }</tbody>
    </table>;
  }
}
