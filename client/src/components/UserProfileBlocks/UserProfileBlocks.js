import React, { useState } from 'react';
import './UserProfileBlocks.scss';

const UserProfileBlocks = props => {
  const [active, setActive] = useState(2);

  return(
    <div className='user-profile-blocks'>
    {props.blocks.map((item, i)=> 
      <div 
        key={i} 
        className={i === active? 'active-block' : 'block'}
        onClick={() => setActive(i)}
      >
        <div className='text'>
          <p className='number'>
            {item.number}
          </p>
          <p className='title'>
            {item.title}
          </p>
        </div>
      </div>  
    )}
    </div>
  )
}

export default UserProfileBlocks;