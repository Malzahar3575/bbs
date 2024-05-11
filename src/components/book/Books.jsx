import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import {Row, Col, Card, InputGroup, Form, Button} from 'react-bootstrap'
import { BsCart4 } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebaseInit'
import {getDatabase, ref, get, set} from 'firebase/database'

const Books = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const uid = sessionStorage.getItem('uid');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState("리액트");
    const [page, setPage] = useState(1);
    const [is_end, setIs_end] = useState(false);
    const callAPI = async() => {
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config = {
            headers:{"Authorization":"KakaoAK f649783f7aee90e8f37b15a6c2ce7c84"}
        };
        
        setLoading(true);
        const res = await axios.get(url, config);
        console.log(res.data);
        setIs_end(res.data.meta.is_end);
        setBooks(res.data.documents);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    }, [page]);
    
    const onSubmit = (e) =>{
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onClickCart = (book) =>{
        if(uid){
            //장바구니에 넣기
            get(ref(db,`cart/${uid}/${book.isbn}`)).then(snapshot=>{
                if(snapshot.exists()){
                    alert("이미 장바구니에 있습니다.");
                    console.log(snapshot);
                }else{
                    if(window.confirm(`${book.title}\n장바구니에 추가하시겠습니까?`)){
                        set(ref(db,`cart/${uid}/${book.isbn}`), {...book});
                        alert('도서등록완료!');
                    }
                }
            });
        }else{
            sessionStorage.setItem('target', '/books');
            navi('/login');
        }
    }
    if(loading) return <h1 className='my-5'>로딩중입니다..</h1>
    return (
        <div>
            <h1 className='my-5'>도서검색</h1>
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
            <Row>
                {books.map(book=>
                    <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
                        <Card>
                            <Card.Body className='justify-content-center d-flex'>
                                <img src={book.thumbnail || 'http://via.placeholder.com/120x170'}/>
                            </Card.Body>
                            <Card.Footer>
                                <div style={{float:'right'}}>
                                    <BsCart4 onClick={()=>{onClickCart(book)}} style={{cursor:'pointer', fontSize:'20px', color:'green'}}/>
                                </div>
                                <div className='ellipsis'>
                                    {book.title}                                    
                                </div>
                                
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            <div>
                <Button disabled={page===1} onClick={()=>{setPage(page-1)}}>이전</Button>
                <span>{page}</span>
                <Button disabled={is_end} onClick={()=>{setPage(page+1)}}>다음</Button>
            </div>
        </div>
    )
}

export default Books
