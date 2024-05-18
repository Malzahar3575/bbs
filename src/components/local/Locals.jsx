import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Row, Col, InputGroup, Form, Button, Table} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebaseInit'
import {getDatabase, ref, get, set} from 'firebase/database'

const Locals = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const uid = sessionStorage.getItem('uid');
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('인하대학교');
    const [page, setPage] = useState(1);
    const [locals, setLocals] = useState([]);
    const callAPI = async() => {
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
            headers:{"Authorization":"KakaoAK f649783f7aee90e8f37b15a6c2ce7c84"}
        };
        
        setLoading(true);
        const res = await axios.get(url, config);
        console.log(res.data);
        setLocals(res.data.documents);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    },[]);

    const onSubmit = (e) =>{
        e.preventDefault();
        if(query===""){
            alert("검색어를 입력해주세요!");
        }else{
            callAPI();
        }
    }

    const onClickFavorite = (local) =>{
        if(!uid){
            sessionStorage.setItem('target', '/locals');
            navi('/login');
            return;
        }
        get(ref(db,`favorite/${uid}/${local.id}`)).then(async snapshot=>{
            if(snapshot.exists()){
                alert("이미 즐겨찾기에 있습니다.");
            }else{
                if(window.confirm(`${local.place_name}\n즐겨찾기에 추가하시겠습니까?`)){
                    await set(ref(db,`favorite/${uid}/${local.id}`), {...local});
                    alert('즐겨찾기 등록완료!');
                }
            }
        });
    }

    if(loading) return <h1 className='my-5'>로딩중입니다..</h1>
    return (
        <div>
            <h1 className='my-5'>지역검색</h1>
            <Row className='mb-2'>
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control 
                                placeholder='검색어'
                                value={query}
                                onChange={(e)=>{setQuery(e.target.value)}}/>
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화번호</td>
                        <td>즐겨찾기</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local=>
                    <tr key={local.id}>
                        <td>{local.id}</td>
                        <td>{local.place_name}</td>
                        <td>{local.address_name}</td>
                        <td>{local.phone}</td>
                        <td className='text-center'><Button onClick={()=>onClickFavorite(local)}>즐겨찾기</Button></td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    )
}

export default Locals
