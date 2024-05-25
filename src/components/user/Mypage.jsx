import React, { useState } from 'react'
import {Row, Col, Card, Button, InputGroup, Form} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const Mypage = () => {
    const [form, setForm] = useState({
        name:"무기명",
        phone:"010-1234-1212",
        address1:'인천 서구 경서동 현대아파트',
        address2:'213동 1104호'
    });

    const {name, phone, address1, address2} = form;

    const onChangeForm = (e) => {
        setForm(
            {
                ...form,
                [e.target.name]:e.target.value
            }
        )

    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(name === ""){
            alert("이름을 입력하세요.");
            return;
        }
        if(!window.confirm("변경된 내용을 저장하실래요?")){
            return;
        }
        //정보를 저장
        console.log(form);
    }
    return (
        <div>
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>이름</InputGroup.Text>
                                <Form.Control name="name" value={name} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>전화</InputGroup.Text>
                                <Form.Control name="phone" value={phone} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>주소</InputGroup.Text>
                                <Form.Control name="address1" value={address1} onChange={onChangeForm}/>
                                <Button>검색</Button>
                            </InputGroup>
                            <Form.Control  name="address2" value={address2} onChange={onChangeForm}
                             placeholder='상세주소'/>
                            <div className='text-center mt-3'>
                                <Button type='submit' className='px-5'>저장</Button>
                                <Button variant='secondary' className = 'ms-2 px-5'>취소</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>

            </Col>
        </Row>
        </div>
    )
}

export default Mypage
