import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {app} from '../../firebaseInit'
import { getFirestore, doc, getDoc, deleteDoc} from 'firebase/firestore'
import {Row, Col, Card, Button} from 'react-bootstrap'
import Comments from './Comments'

const ReadPage = () => {
    const navi=useNavigate();
    const loginEmail = sessionStorage.getItem('email');
    const {id}=useParams();
    //console.log(id);
    const db = getFirestore(app);
    const [post, setPost] = useState({});

    const callAPI = async() =>{
        const res = await getDoc(doc(db, `posts/${id}`));
        //console.log(res.data());
        setPost(res.data());
    }
    const {email, date, title, contents} = post;
    useEffect(()=>{
        callAPI();
    },[])
    const onClickDelete = async() => {
        if(!window.confirm(`${id}번 게시글을 삭제하실래요?`)){
            return;
        }
        //게시글 삭제
        await deleteDoc(doc(db,`posts/${id}`));
        window.location.href='/bbs';
        // navi('/bbs')
    }
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>게시글 정보</h1>
                {loginEmail===email &&
                    <div className='text-end mb-2'>
                        <Button onClick={()=>{navi(`/bbs/update/${id}`)}}
                        variant='success' size='sm' className='me-2'>수정</Button>
                        <Button variant='danger' size='sm' onClick={onClickDelete}>삭제</Button>
                    </div>}
                <Card>
                    <Card.Body>
                        <h5>{title}</h5>
                        <div className='text-muted'>
                            <span className='me-3'>{date}</span>
                            <span>{email}</span>
                        </div>
                        <hr/>
                        <div style={{whiteSpace:'pre-wrap'}}>{contents}</div>
                    </Card.Body>
                </Card>
                <Comments/>
            </Col>
        </Row>
    )
}

export default ReadPage
