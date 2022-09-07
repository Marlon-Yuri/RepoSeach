import React, { useState, useCallback, useEffect } from 'react'
import {Container, Form, SubmitButton, List,BtnDelete} from './styles'
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import API from '../services/api'
 
export default function Main() {
  const [input, setInput] = useState('')
  const [repos, setRepos] = useState([])
  const [isLoading, setIsloading] = useState(false)
  const [alerta, setAlerta] = useState(null)
 
//BUSCANDO NO LOCAL
  useEffect(() => {
     if(localStorage.getItem('repos')){
      setRepos(JSON.parse(localStorage.getItem('repos')))
     }
  }, [])
  

//SALVANDO NO LOCAL
  // useEffect(() => {
  //    localStorage.setItem('repos', JSON.stringify(repos))
  // }, [repos])

 const SrcRepo = useCallback((e) =>{
  e.preventDefault()

  async function submit(){
    setIsloading(true)
    setAlerta(null)
    try{
      if(input === ''){
        throw new Error('Procure um repositório válido')
      }
       const response = await API.get(`repos/${input}`)
       console.log(response.data)

       const hasRepos = repos.find(item => item.name === input)

       if(hasRepos){
        throw new Error('Repositório já existe')
       }
   const data = {
     name: response.data.full_name
   }

   setRepos([...repos, data])
   localStorage.setItem('repos', JSON.stringify([...repos,data]))
   setInput('')
  }catch(error){
    setAlerta(true)
    console.log(error)
  }finally{
    setIsloading(false)
  }
  }
  submit()
  },[repos,input])
    
   
  const handleDelete = useCallback((id) =>{
   const Find = repos.filter(item => item.id !== id)
   setRepos(Find)
   localStorage.setItem('repos', JSON.stringify(Find))
  }, [repos])


  return (
    <Container>

        <h1>
         <FaGithub size={30}/>
          Meus repositórios
        </h1>

        <Form onSubmit={(e)=> SrcRepo(e)}   error={alerta}>
          <input value={input} onChange={e =>setInput(e.target.value)} type='text' placeholder='Add Repos'/>

          <SubmitButton loading={isLoading ? 1 : 0} type='submit'>
            {isLoading ? (
              <FaSpinner color = 'FFF' size={15}/>
            ) : (
               <FaPlus color='#FFF' size={15}/>
            )}   
          </SubmitButton>
        </Form>

        <List>
         
            {repos.map( item => (
              <li key={item.name}>
                <span>
                <BtnDelete onClick={() =>{handleDelete(item.id)}}>
                  <FaTrash size={14} />
                </BtnDelete>  
                {item.name}</span>
                <Link to={`/repositorio/${encodeURIComponent(item.name)}`}>
                  <FaBars size={20}/>
                </Link>
              </li>
            ))}
        
        </List>
    </Container>
  )
}
