import React, { useState, useEffect } from 'react';
import PageButton from '../PageButton/PageButton';
import { withRouter } from 'react-router-dom';

const PagePagination = props => {
  const [pages, setPages] = useState([]);
  const [maxPages, setMaxPages] = useState(0);

  useEffect(() => {
    createStartPages();
  }, [])

  useEffect(() => {
    const newPage = +props.currentPage;
    let i = 1;
    let newPages = [];
    newPages.push(newPage);
    while(newPages.length < 5 && newPages.length < maxPages){
      if(newPage - i > 0)
        newPages.push(newPage - i);
      if(newPage + i <= maxPages)
        newPages.push(newPage + i);
      i++;
    }
    setPages(newPages.sort((a,b) => a - b));
  }, [props.match.params, maxPages])

  useEffect(() => {
    setMaxPages(Math.ceil(props.pageCount))
  }, [props.pageCount])

  const createStartPages = () =>{
    let startPagesCount;
    if(maxPages >= 5)
      startPagesCount = 5;
    else
      startPagesCount = maxPages;
    let newPages = [];
    for(let i = 1; i < startPagesCount + 1; i++)
      newPages.push(i);
    setPages(newPages);
  }

  const changePage = newPage => {
    props.history.push(`${props.component}/${newPage}`)
  }

  const handleClick = async e => {
    const newPage = Number(e.target.id);
    changePage(newPage);
  }

  const routeToFisrtPage = e => {
    createStartPages();
    changePage(1);
  }

  const routeToLastPage = e => {
    createStartPages();
    changePage(maxPages);
  }

  const incrementPage = async e => {
    const newPage = +props.currentPage === maxPages? +props.currentPage : +props.currentPage + 1;
    changePage(newPage);
  }

  const decrementPage = async e => {
    const newPage = props.currentPage > 1 ? +props.currentPage - 1 : +props.currentPage;
    changePage(newPage)
  }

  const renderPageNumbers = pages.map(number => {
    return (  
      <li
        style={{cursor: 'pointer', listStyle: 'none', margin: '0 0.2vw'}}
        key={number}
        id={number}
        onClick={handleClick}
      >
        {number}
      </li>
    );
  });

  return (
    <>
      <ul style={{ display: 'flex', justifyContent: 'center', padding: 0}}>
        <PageButton
          func={routeToFisrtPage} 
          page={props.currentPage} 
          text={'««'} 
        />
        <PageButton
          func={decrementPage} 
          text={'«'} 
        />
          {renderPageNumbers}
        <PageButton
          func={incrementPage}
          page={props.currentPage}
          text={'»'}
        />
        <PageButton
          func={routeToLastPage}
          text={'»»'}
        />
      </ul>
    </>
  )
}

export default withRouter(PagePagination);