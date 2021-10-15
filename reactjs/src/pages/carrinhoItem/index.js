import { StyledCarrinhoItem } from "./styled"
import Cabecalho from "../../components/cabecalho"
import Footer from "../../components/rodape"
import { StyledInput } from "../../components/input/styled"
import { StyledButtonVerde } from "../../components/botaoVerde/styled"

import { Link } from "react-router-dom"
import Cookie from 'js-cookie'
import { useState, useEffect } from "react"
import { useHistory } from "react-router"

import BoxItemCarrinho from './comps/boxItem'

export default function CarrinhoItem() {

    const [ produto, setProduto ] = useState([])
    const [ vlFinal, setVlFinal ] = useState(0)
    

    const navegation = useHistory()

    useEffect(carregarCarrinho, [])

    
   


    function removerProduto (id) {

        let carrinho = produto.filter(x => x.id_produto !== id) 

        Cookie.set('carrinho', JSON.stringify(carrinho))
        setProduto([...carrinho])

       
       
        carregarCarrinho()

    }



    function carregarCarrinho() {
        let carrinho = Cookie.get('carrinho');
        carrinho = carrinho !== undefined
            ? JSON.parse(carrinho)
            : [];

            if(Cookie.get('carrinho') === undefined)
            
            navegation.push('/carrinho')

            
            

        setProduto(carrinho)
    }



   function respFilho(vlPreco) {
        let total = produto.reduce((a,b) => a + b.total,0)
        setVlFinal (total)  
   }

 

   

    return (
        <div style={{backgroundColor:"#333333"}}>
        <Cabecalho />
        
    
        
       <StyledCarrinhoItem> 
       <main className="pc"> 
          
                <div className="cabecalho"> 
                    <div className="titulo"> Carrinho: </div>
                    <div class="itens-direita"> 
                        <div className="quantidade"> Quantidade: </div>
                        <div className="preco"> Preço: </div>
                    </div>
                </div>
               
                
                {produto.map(x => 
                <BoxItemCarrinho key={x.id_produto} info={x} onRemove={removerProduto} respostaFilho={respFilho}/> 
                   
                )}
                
                
               
                <div className="agp-realizar">
                    <div className="row-preco"> 
                        <div className="sub-total-baixo"> Sub-Total: </div>
                        <div className="sub-valor-final"> {` R$: ${Math.round(vlFinal)}`} </div>
                    </div>
                    <div className="row-preco"> 
                        <div className="total-valor-baixo"> Total: </div>
                        <div className="total-final"> R$:99,99 </div>
                    </div>
                    <div className="botao-finalizar"> <Link to="/concluirCompra"> <StyledButtonVerde style={{padding: ".3em", marginBottom:"1em", marginRight: "2em", width:"14em"}}> Realizar Compra! </StyledButtonVerde> </Link> </div> 
                </div>
                </main>



               <main className="cell"> 
                <div className="cabecalho"> 
                    <div className="titulo"> Carrinho: </div>
                </div>
               
               
                {produto.map(x => 
                    <BoxItemCarrinho key={x.id_produto} info={x} onRemove={removerProduto}  /> 
                )}
                 <div className="row-input"> 
                            <div className="frete"> Frete: </div>
                            <div className="input-frete">  <StyledInput placeholder="Cep"  className="cep"/> </div>
                            <div className="botao-frete">  <StyledButtonVerde style={{width: "7em", height:"1.8em", marginLeft:"2em"}}> Calcular </StyledButtonVerde> </div>
                        </div>
                    <div className="valor-cep">
                        <div className="rua"> Nome da Rua Bonito  </div>
                        <div className="bairro"> Bairro com Nome Bonito  </div>
                        <div className="estado">  Cidade com Nome Bonita </div>
                        </div>
                       
                   
                    <div className="row-val"> 
                        <div className="titulo-val"> Previsão: </div>
                        <div className="valor-val1"> 4 dias </div>
                    </div>

                <div className="agp-realizar">
                    <div className="row-preco"> 
                        <div className="sub-total-baixo"> Sub-Total: </div>
                        <div className="sub-valor-final"> R$:79,99</div>
                    </div>
                    <div className="row-preco"> 
                        <div className="total-valor-baixo"> Total: </div>
                        <div className="total-final"> R$:99,99 </div>
                    </div>
                    <div className="botao-finalizar"> <Link to="/concluirCompra"> <StyledButtonVerde style={{padding: ".3em"}} className="green">  Realizar Compra!  </StyledButtonVerde> </Link>   </div> 
                </div>
                </main> 
       </StyledCarrinhoItem>
       
      
       <Footer />
       </div>
    )
}