import React, { useEffect, useState } from 'react'
import {Row, Col, Form, Button} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore'
import { useParams } from 'react-router-dom'

const UpdatePage = () => {
    const db = getFirestore(app);
    const {id}=useParams();
    const [form, setForm] = useState({
        contents:'',
        title:'',
        email:'',
        date:''
    });
    const {contents, title} = form;
    const callAPI = async() =>{
        const res = await getDoc(doc(db, `posts/${id}`));
        //console.log(res.data());
        setForm(res.data());
        //console.log(form);
    }
    const onChangeForm = (e) =>{
        setForm(
            {
                ...form,
                [e.target.name]:e.target.value
            }
        )
    }

    useEffect(()=>{
        callAPI();
    },[])

    const onUpdate = async() => {
        if(title==="" || contents===""){
            alert("제목과 내용을 입력하세요");
            return;
        }
        if(!window.confirm("수정하시겠습니까?")){
            return;
        }
        //console.log(data);
        await updateDoc(doc(db, `posts/${id}`), form);
        //alert('게시글 등록 완료')
        window.location.href='/bbs';
    }
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>글수정</h1>
                <div className='mt-5'>
                    <Form.Control name = "title"
                    value={title}
                    onChange={onChangeForm}
                    className='mb-2'
                    placeholder='제목을 입력하세요'></Form.Control>
                    <Form.Control name = "contents"
                    value={contents}
                    onChange={onChangeForm}
                    as="textarea" rows={10} placeholder='내용을 입력하세요'></Form.Control>
                    <div className='text-center mt-3'>
                        <Button className='px-5 me-2' onClick={onUpdate}>수정</Button>
                        <Button className='px-5' variant='secondary'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default UpdatePage
