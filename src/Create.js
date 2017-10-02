import React,{Component} from 'react';
import {Input,Button} from 'semantic-ui-react';
import contract from 'truffle-contract';
import Bidding from '../build/contracts/Bidding.json';
import getWeb3 from './utils/getWeb3';
import * as firebase from 'firebase';

class Create extends Component{

    constructor(props){
        super(props);
        this.state={
            web3:null
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.bidding = contract(Bidding);
    }

    componentDidMount(){
        
                getWeb3.then(results => {
                    this.setState({
                      web3: results.web3
                    })
                  }).then(()=>{
                      console.log('good');
                    this.bidding.setProvider(this.state.web3.currentProvider)
                  })
                  .then(()=>{
                    this.state.web3.eth.getAccounts((error, accounts) => {console.log('ok');});
                })
                
            }

    handleSubmit(event){
        event.preventDefault();
        const UserBidValue= parseInt(event.target.leastBid.value,10);
        const _title=event.target.title.value;
        const _description=event.target.description.value;
        this.state.web3.eth.getAccounts((error, accounts) => {
            this.bidding.new([UserBidValue,_title,_description],{from:accounts[0]}).then((instance) => {
              this.newContractAddress = instance.address;
              this.ContractAddress = instance.address;
              this.transactionHash = instance.transactionHash;
              let newBid={
                  contract:instance.address,
                  txhash:instance.transactionHash,
                  baseBid:UserBidValue,
                  title:_title,
                  description:_description,
              }
              firebase.database().ref('bids/'+this.props.currentUser.uid).push(newBid).then(()=>{console.log('Bid created');})
            })
        })
    }

    render(){
        return(
            <div>
                <form style={{textAlign:'center'}} onSubmit={this.handleSubmit}>
                    <Input placeholder='Title' name='title'/><br /><br />
                    <Input placeholder='Description' name='description'/><br /><br />
                    <Input placeholder='least bid' name='leastBid'/><br /><br />
                    <Button color='green'>Create Contract</Button>
                </form>
            </div>
        );
    }
}

export default Create;