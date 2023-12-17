import Web3 from "web3";
import {useState, useEffect, useContext} from "react";
import ResearchPaperBid from "../contracts/ResearchPapers.json"

function PaperDetails() {

  const [author_address, set_author_address] = useState("Nil");
  const [state, setState] = useState({web3: null, contract: null});
  const [ownerAddress, setAddress] = useState("Nil");
  const [prev_owner, setprev_owner] = useState("Nil");
  const [pres_owner, setpres_owner] = useState("Nil");
  const [pr_name, setpr_name] = useState("Nil");
  const [pr_url, setpr_url] = useState("Nil");

  useEffect(() => {
    //below is the ganache address
    //const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    async function template(){
      try {if(window.ethereum){
        console.log("Metamask exists");
        await window.ethereum.request({method: 'eth_requestAccounts'});
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        console.log("Owner is", accounts[0]);
        const networkId = await web3.eth.net.getId();
        console.log("Network ID is", networkId);
        console.log("Research paper bid is", ResearchPaperBid.networks);
        const deployedNetwork = ResearchPaperBid.networks[networkId];
        console.log("Deployed Network is", deployedNetwork)
        const contract = new web3.eth.Contract(ResearchPaperBid.abi, deployedNetwork.address, {
          from: accounts[0],
          gas: '3000000'
        });
        setState({web3: web3, contract: contract});
        setAddress(accounts[0]);
      }
    }
    catch (error){
      console.error(error);
    }
    }
    template();
  }, []);


  async function research_paper_owner(){
    const {contract} = state;
    const tokenId = document.querySelector("#value3").value;
    console.log("Token id entered is, ", tokenId);
    //from address below can be from any account
    (contract.methods.ownerOf(tokenId).call({from: ownerAddress})).then(data => set_author_address(data));
  }

  async function research_paper_details(){
    const {contract} = state;
    const tokenId = document.querySelector("#value3").value;
    console.log("Token id entered is, ", tokenId);
    //from address below can be from any account
    (contract.methods.display_PaperDetails(tokenId).call({from: ownerAddress})).then(data => {
      setpres_owner(data['present_owner']);
      setprev_owner(data['previous_owner']);
      setpr_name(data['name']);
      setpr_url(data['paper_url']);
      console.log("Research paper details are:", data['id']);
    });
  }

  return (
    <div className="paperdetails">
      {/* <h1>Paper</h1> */}
      <br/>
      <p>Please enter token ID to find the details of the research paper</p>
      <label for="value3">Enter Token ID here   </label>
      <input type = "text" id = "value3" name = "value3"></input>
      <br/>
      <br/><button class = "button pdet" onClick={research_paper_owner}>Get Author address</button><br/><br/>
      <p>Author address is: {author_address}</p>
      <br/><button class = "button pdet" onClick={research_paper_details}>Get Research Paper details</button><br/><br/>
      {/*printing the owner address with the id*/}
      
      <p>Paper Name is: {pr_name}</p>
      <p>Present owner is: {pres_owner}</p>
      <p>Previous owner is: {prev_owner}</p>
      <p>Paper url is: {pr_url}</p>
      <p id="owner_address"></p>
    </div>
    
  );
}

export default PaperDetails;
