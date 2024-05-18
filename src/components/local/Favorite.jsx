import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseInit'
import {getDatabase, ref, onValue, remove} from 'firebase/database'
import {Button, Table} from 'react-bootstrap'

const Favorite = () => {
    const uid = sessionStorage.getItem('uid');
    const db = getDatabase(app);
    const [favorite, setFavorite] = useState([]);
    const [loading, setLoading] = useState(false);
    const callDB = () =>{
        setLoading(true);
        onValue(ref(db, `favorite/${uid}`), snapshot => {
            const rows = [];
            snapshot.forEach(row=>{
                rows.push({...row.val()});
            })
            console.log(rows);
            setFavorite(rows);
            setLoading(false);
        });
    }

    const onClickDelete = (local) => {
        if(window.confirm(`${local.place_name}\n삭제하시겠습니까?`)){
            //삭제하기
            remove(ref(db, `favorite/${uid}/${local.id}`));
        }
    }

    useEffect(()=>{
        callDB();
    }, [])

    if(loading) return <h1 className='my-5'>로딩중입니다..</h1>
    return (
        <div>
            <h1 className='my-5'>즐겨찾기</h1>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화번호</td>
                        <td>취소</td>
                    </tr>
                </thead>
                <tbody>
                    {favorite.map(local=>
                    <tr key={local.id}>
                        <td>{local.id}</td>
                        <td>{local.place_name}</td>
                        <td>{local.address_name}</td>
                        <td>{local.phone}</td>
                        <td className='text-center'><Button onClick={()=>onClickDelete(local)}>취소</Button></td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    )
}

export default Favorite
