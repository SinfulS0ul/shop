import React, { useState } from 'react';
import './DropdownCategories.scss';
import AppsIcon from '@material-ui/icons/Apps';

const DropdownCategories = props => {
  const [displayMenu, setDisplayMenu] = useState(false);

  return (
    <div className='dropdown'>
      <button className='dropdown__button' onClick={() => setDisplayMenu(!displayMenu)}> Choose Category </button>
      <AppsIcon className='dropdown__frid-icon'/>
      {displayMenu ? (
        <ul>
          <li>Toys</li>
          <li>Pets</li>
          <li>Weapon</li>
          <li>Technic</li>
        </ul>
      ) :
        (
          null
        )
      }
    </div>

  );
}

export default DropdownCategories;