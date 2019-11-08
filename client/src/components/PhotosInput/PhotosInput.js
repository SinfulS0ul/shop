import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import './PhotosInput.scss';


const PhotosInput = props => {
  return (
    <div>
      <label className='photos-label'>PHOTOS</label>
      <div className='file-input'>
        {props.photosPreview.length < 6 && 
          <label htmlFor={props.component} className='add-photo-button'>
            <AddIcon style={{ position: 'absolute', fontSize: '4.9vw', color: '#349A89', left: '0.5vw'}}/>
            <input 
              type='file'
              id={props.component}
              name='photos' 
              onChange={e => props.addPhotos(e)} 
              multiple 
              accept='image/png, image/jpeg, image/jpg'
            />
          </label>
        }
        {props.photosPreview.map((photo, i) => 
          <label key={i} className='photo'>
            <img src={photo}/>
            <CloseIcon
              style={{ position: 'absolute', fontSize: '2vw', color: 'white', right:'0', top:'0', cursor: 'pointer'}}
              onClick={() => props.deletePhoto(i)}
            />
          </label>
        )}
      </div>
    </div>
  )
}

export default PhotosInput;