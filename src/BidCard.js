import React, { Component } from 'react';
//import * as firebase from 'firebase';
import { Button, Card, Input } from 'semantic-ui-react';
import contract from 'truffle-contract';
import Bidding from '../build/contracts/Bidding.json';
import getWeb3 from './utils/getWeb3';


export default class BidCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMax: 0,
      web3: null,
      title: '',
      description: ''
    }
    this.bidding = contract(Bidding);
    this.getMax = this.getMax.bind(this);
    this.putBid = this.putBid.bind(this);
  }

  componentDidMount() {
    let _title = '';
    let _description = '';
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })
    })
      .then(() => {
        this.bidding.setProvider(this.state.web3.currentProvider)
      })
      .then(()=>{
        this.bidding.at(this.props.currentBid.contract).then((instance) => {
          console.log(instance);
          instance.ShowMax().watch((err,resp)=>{
            let max= resp.args.max.c[0];
            if(max>0){
              this.setState({currentMax:max});
            }
            else{
              console.log(max);
              this.setState({currentMax:'Not yet'});
            }
            
          });
          instance.AnnounceWinner().watch((err,resp)=>{
            console.log(resp);
          })
        })
        this.getMax();
      })
      
  }

  getMax() {
    this.state.web3.eth.getAccounts((error, accounts) => {

      this.bidding.at(this.props.currentBid.contract).then((instance) => {

        return instance.getBid.call({
          from: accounts[0]
        })
      }).then((result) => {
        console.log(result);
        if(result.c[0]>0){  // check wheather even one person placed the bid or not
          this.setState({
            currentMax: result.c[0]
          });
        }
        else{
          this.setState({currentMax: 'Not yet'})
        }  
        
      })
    })


    this.state.web3.eth.getAccounts((error, accounts) => {
      
            this.bidding.at(this.props.currentBid.contract).then((instance) => {
      
              return instance.getTitle.call({
                from: accounts[0]
              })
            }).then((result) => {
              console.log(result);
              
            })
          })
  }

  putBid(e) {
    e.preventDefault();
    let value = e.target.putbid.value;
    console.log(value);
    let newBid = parseInt(value, 10);
    this.state.web3.eth.getAccounts((error, accounts) => {
      let address = accounts[0];
      this.bidding.at(this.props.currentBid.contract).then((instance) => {
        return instance.putBid(newBid, {
          from: address
        });
      })
        .then(() => {
          console.log('success');
        })
        .catch((error) => {
          console.log(error);
        })
    })
  }

  render() {
    return (
      <div>
        <Card>
          <Card.Content>
            <Button style={ { float: 'right' } } primary onClick={ this.getMax }>Refresh</Button>
            <Card.Header>
              Max:
              { this.state.currentMax }
            </Card.Header>
            <Card.Meta>
              Base:
              { this.props.currentBid.baseBid }
            </Card.Meta>
            <Card.Description style={ { fontSize: '12px' } }>
              { this.props.currentBid.contract }
              <b>{ this.state.title }</b>
              <i>{ this.state.description }</i>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <form onSubmit={ this.putBid }>
              <Input label={ <Button color='green' type='submit'>Put bid</Button> } labelPosition='right' name='putbid' placeholder='Put Your Bid' />
            </form>
          </Card.Content>
        </Card>
      </div>
      );
  }
}
