import Cookies from 'js-cookie';
import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Cabecalho from "../../components/cabecalho";
import Footer from "../../components/rodape";
import { Container } from "./styled";
import { toast, ToastContainer } from 'react-toastify'
import LoadingBar from 'react-top-loading-bar'


import Api from "../../services/api";
import axios from 'axios';
const api = new Api();

function UsuarioIndex() {

    const nave = useHistory();
    const [all, setAll] = useState({})

    let usuarioLogado = lerUsuarioQuelogou() || {}

    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [imagem, setImagem] = useState('');
    const [estadoSenha, setEstadoSenha] = useState(0);
    const barraCarregamento = useRef(null);
    const [imgUsuario, setImgUsuario] = useState(null);

    

    function lerUsuarioQuelogou() {
        let logado = Cookies.get('usuario-logado');

        if (logado === undefined) {
            alert('Você deve estar logado para acessar essa página');
            nave.push('/login')
        } else {
            let usuarioLogado = JSON.parse(logado);
            return usuarioLogado;
        }
    }

    const logof = () => {
        Cookies.remove("usuario-logado");
        const situacao = new Promise(resolve => setTimeout(resolve, 2000));

        toast.promise(situacao, {
            pending: "Saindo",
            success: "Logoff",
            theme: 'light'
           
        })

        nave.push('/')
      
      };

    async function lerUsuario() {
        barraCarregamento.current.continuousStart();
        let get = await api.listarUsuario(usuarioLogado.id_usuario)
        
        if(get.erro)
            toast.error(get.erro)

        setAll(get)
        setarVariavel(all);

        barraCarregamento.current.complete();  

    }
    
  

  

    async function alterar() {

        let formData = new formData();
        formData.append('imgUsuario', imgUsuario);
        formData.append('id', usuarioLogado.id);
        formData.append('nome', nome);
        formData.append('cpf', cpf);
        formData.append('senha', senha);
        formData.append('email', email)
       
        //let put = await api.alterarUsuario(usuarioLogado.id_usuario, nome, cpf, senha, email);
        let put = await axios.put('/usuario', formData, {
            headers: {
               'Content-type': 'nultpart/form-data' 
            }
        })

        const situacao = new Promise(resolve => setTimeout(resolve, 2000));
        
        if(put.erro)
            toast.error(put.erro)
              
        toast.promise(situacao, {
            pending: "Alterando informações...",
            success: "Usuário alterado 👌",
            theme: 'light'
           
        })

        lerUsuario()
       
    }

   

    function estadoDaSenha(senha) {
     
        if (senha === 0)
            return 'password'
        else if (senha === 1)
            return 'text'
       
    }

    function getImage() {
        if (all.img_usuario.includes('http'))
            return all.img_usuario
        else
            return `http://localhost:3000/usuario?imagem=${all.img_usuario}`
    }

    async function setarVariavel(retornoAPI) {
        setNome(retornoAPI.nm_usuario)
        setEmail(retornoAPI.ds_email)
        setSenha(retornoAPI.ds_senha)
        setCpf(retornoAPI.ds_cpf)
        setImagem(retornoAPI.img_usuario)
    }

    function verImagem () {
        if (imgUsuario)
            return URL.createObjectURL(imgUsuario)
    }

    useEffect(() => {
        lerUsuarioQuelogou()
        lerUsuario()
    }, [])

    console.log(estadoDaSenha(estadoSenha))
    return (

        <div style={{ backgroundColor: "#333333" }}>
            
            <ToastContainer />
            <LoadingBar color="orange" ref={ barraCarregamento } />
            <Cabecalho corLetra="nulo" />
            <div style={{maxWidth:"1240px", margin:"auto"}}> 
            <Container>
                <article class="my-account">
                    <div className="user-picture">
                        <div className="img-user">
                                {imgUsuario === null
                                        ? <img src={getImage} alt="" style={{ marginRight: "3em" }} />
                                        : <img src={verImagem()} alt="" style={{marginRight: "3em"}} />
                                }
                        </div>
                        <div className="camera">
                            <button>
                               <input type="file" className="upload" onChange={(e) => setImgUsuario(e.target.files[0])} />
                            </button>
                        </div>
                    </div>

                    <div className="personal-information">
                        <div className="sub-group-input">
                            <label> NOME </label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
                        </div>

                        <div className="sub-group-input">
                            <label> E-MAIL </label>
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                    <div className="agp-botao">
                        <div className="change-information">
                            <button onClick={alterar}>Alterar Informações</button>
                        </div>
                        <div className="change-information">
                            <button onClick={logof}> Fazer Logof </button>
                        </div>
                        </div>
                    </div>

                    <div className="personal-information">
                        <div className="sub-group-input">
                            <label> CPF </label>
                            <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} />
                        </div>

                        <div className="sub-group-input">
                            <label> SENHA</label>
                            <div className="inputSenha"><input type={estadoDaSenha(estadoSenha)} value={senha} onChange={e => setSenha(e.target.value)}></input> <img src="/assets/images/iconSenha.svg" onClick={ e =>  estadoSenha === 0 ? setEstadoSenha(1) : setEstadoSenha(0)}/> </div>
                            
                        </div>

                    </div>


                </article>
            </Container>
            </div>
            <Footer />
            
        </div>
    )
}

export default UsuarioIndex;