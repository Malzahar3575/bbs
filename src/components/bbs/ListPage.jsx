import React, { useEffect, useState } from 'react'
import {Row, Col, Button, Table} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import { getFirestore, collection, onSnapshot, query, orderBy} from 'firebase/firestore'
import Pagination from 'react-js-pagination'
import '../Paging.css'

const ListPage = () => {
    const db = getFirestore(app);
    const email = sessionStorage.getItem('email');
    const uid = sessionStorage.getItem('uid');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(4);
    const [total, setTotal] = useState(0)

    const callAPI = () =>{
        const q = query(collection(db, 'posts'), orderBy('date', 'desc'))
        onSnapshot(q, snapshot=>{
            let rows = [];
            let no=0;
            snapshot.forEach(row=>{
                no++;
                rows.push({no, id:row.id, ...row.data()})
            });
            //console.log(rows);
            const start=(page-1) * size + 1;
            const end=(page * size);

            let data=rows.map((row,index)=>row && {seq:no-index, ...row});
            data=data.filter(row=>row.no>=start && row.no<=end);
            console.log(data);
            setPosts(data);
            setTotal(no);
        });
    }

    useEffect(()=>{
        callAPI();
    },[page])

    return (
        
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1 className='mb-5'>게시글 목록</h1>
                {uid && 
                <div className='text-end mb-3'>
                    <a href='/bbs/insert'>
                    <Button className='px-5'>글쓰기</Button>
                    </a>
                </div>
                }
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Title</td>
                            <td>Writer</td>
                            <td>Date</td>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post=>
                            <tr key={post.key}>
                                <td>{post.seq}</td>
                                <td><a href={`/bbs/read/${post.id}`}>{post.title}</a></td>
                                <td>{post.email}</td>
                                <td>{post.date}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Pagination className="pagination"
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e)=>setPage(e)}/>
            </Col>

        </Row>

    )
}

export default ListPage
