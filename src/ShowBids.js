import React,{Component} from 'react';
import * as firebase from 'firebase';
import { Card } from 'semantic-ui-react';
import BidCard from './BidCard';

export default class ShowBids extends Component{

    constructor(props){
        super(props);
        this.state={allBids:null}
    }

    componentDidMount(){
        firebase.database().ref('bids').on('value',snap=>{

            this.setState({
                allBids:snap.val()
            });
            // let data=snap.val();
            // Object.keys(data).map((user)=>{
            //     Object.keys(data[user]).map(bid=>{
            //         console.log(data[user][bid]);
            //     })
            // })
        });
    }

    render(){
        
        if(!this.state.allBids){
            return(
                <div>
                    Interacting....
                </div>
            );
        }
        else{
            let allItems=[];
            allItems=Object.keys(this.state.allBids).map((user)=>{
                    return Object.keys(this.state.allBids[user]).map(bid=>{
                        return <BidCard currentBid={this.state.allBids[user][bid]} />
                         })
                })
            return(
                <Card.Group>
                    {allItems}
                </Card.Group>
            );
        }
    }
}