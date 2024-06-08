import React, { useEffect, useState } from 'react'
import {Button, Col, Form, Row} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import {app} from '../../firebaseInit'
import { getFirestore, collection, addDoc, query, orderBy, where, onSnapshot, deleteDoc, doc, updateDoc} from 'firebase/firestore'
import moment from 'moment'

const Comments = () => {
    const email = sessionStorage.getItem('email');
    const {id} = useParams();
    const [contents, setContents] = useState('');
    const [comments, setComments] = useState([]);
    const db = getFirestore(app);
    const callAPI = () =>{
        const q = query(collection(db, 'comments'), where('pid','==',id), orderBy('date', 'desc'))
        onSnapshot(q, snapshot=>{
            let rows = [];
            snapshot.forEach(row=>{
                rows.push({id:row.id, ...row.data()})
            });
            // console.log(rows);
            const data = rows.map(row=>row && {...row, ellip:true, isEdit:false, text:row.contents})
            setComments(data);
        });
    }
    useEffect(()=>{
        callAPI();
    },[])
    const onClickInsert = () =>{
        sessionStorage.setItem('target',`/bbs/read/${id}`)
        window.location.href='/login';
    }

    const onInsert = async() =>{
        if(contents === "") {
            alert("댓글 입력하세요");
            return;
        }
        const data = {
            pid: id,
            email,
            contents,
            date:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }
        // console.log(data);
        await addDoc(collection(db, '/comments'), data);
        alert("완료");
        setContents("");
    }
    const onClickContents = (id) =>{
        const data = comments.map(com=> com.id===id ? {...com, ellip:!com.ellip} : com);
        setComments(data);
    }

    const onClickDelete = async(id) => {
        if(!window.confirm(`${id}번 댓글을 삭제하실래요?`)){
            return;
        }
        await deleteDoc(doc(db, `comments/${id}`));
    }
    const onClickUpdate = (id) => {
        setComments(
            comments.map(com=> com.id===id ? {...com, isEdit:true} : com)
        )
    };
    const onClickCancel = (comment) => {
        if (comment.text !== comment.contents &&
            !window.confirm("변경된 내용을 취소하시겠습니까?")
        ){
            return;
        }
        setComments(
            comments.map(com=> com.id===comment.id ? {...com, isEdit:false, contents:com.text} : com)
        )
    }

    const onChangeContents = (e, id) => {
        const data = comments.map(com=> com.id===id ? {...com, contents:e.target.value} : com);
        setComments(data);
    }

    const onClickSave = async(com) => {
        if(!window.confirm("변경된 내용을 저장하실래요?")){
            return;
        }
        await updateDoc(doc(db, `comments/${com.id}`), com);
    }
    return (
        <div className='my-5'>
            {!email ?
            <div className='text-end'>
                <Button className='px-5' onClick={onClickInsert}>댓글등록</Button>
            </div>
            :
            <div>
                <Form.Control value={contents} onChange={(e)=>{setContents(e.target.value)}}
                as='textarea' row={5} placeholder='댓글 내용을 입력하세요.'></Form.Control>
                <div className='text-end mt-2'>
                    <Button onClick={onInsert} className='px-3'>등록</Button>
                </div>
            </div>
        }
        <div className='my-5'>
            {comments.map(com=>
                <div key={com.id}>
                    <Row>
                        <Col className='text-muted'>
                        <span className='me-2'>{com.email}</span>
                        <span>{com.date}</span>
                        </Col>
                        {email===com.email && !com.isEdit && 
                            <Col className='text-end mb-2'>
                                <Button size='sm' className='me-2' onClick={()=>onClickUpdate(com.id)}>수정</Button>
                                <Button size='sm' variant='danger' onClick={()=>onClickDelete(com.id)}>삭제</Button>
                            </Col>
                        }
                        {email===com.email && com.isEdit && 
                            <Col className='text-end mb-2'>
                                <Button size='sm' className='me-2' variant='success'
                                disabled={com.contents === com.text}
                                onClick={()=>onClickSave(com)}>저장</Button>
                                <Button size='sm' variant='secondary' 
                                onClick={()=>onClickCancel(com)}>취소</Button>
                            </Col>
                        }
                        
                    </Row>
                    {com.isEdit ?
                    <Form.Control onChange={(e) => onChangeContents(e, com.id)}
                    value={com.contents} as = "textarea" rows={5}/>
                    :
                    <div style={{whiteSpace:'pre-wrap', cursor:'pointer'}}
                     className={com.ellip ? 'ellipsis' : undefined}
                     onClick={()=>{onClickContents(com.id)}}>
                        {com.contents}
                    </div>
                    }
                    <hr/>
                </div>
            )}
        </div>
        </div>
    )
}

export default Comments
