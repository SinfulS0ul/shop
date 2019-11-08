import React, { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import axios from 'axios';
import PhotosInput from '../PhotosInput/PhotosInput';
import { getAllProducts, setModal } from '../../store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';

const SellProductInputs = props => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photosPreview, setPhotosPreview] = useState([]);

  const userId = useSelector(state => state.auth.user.id);
  const isAuthentificated = useSelector(state => state.auth.isAuthentificated);
  const modal = useSelector(state => state.modal.modal);

  const dispatch = useDispatch();

  const handleInputChange = e => {
    const target = e.target;
    const name = target.name;
    switch (name) {
      case 'title':
        setTitle(target.value);
        break;
      case 'location':
        setLocation(target.value);
        break;
      case 'description':
        setDescription(target.value);
        break;
      case 'price':
        setPrice(target.value);
        break;
    }
  }

  const addPhotos = e => {
    let files = e.target.files;
    for (let i = 0 ; i < files.length ; i++) {
      let reader = new FileReader();
      let file = files[i]
      setPhotos([...photos, file]);
      reader.onloadend = () => {
        setPhotosPreview([...photosPreview, reader.result]);
      }
      reader.readAsDataURL(file);
    }
  }

  const onSubmit = e => {
    e.preventDefault();
    if(isAuthentificated){
      const formData = new FormData();
      for (let i = 0 ; i < photos.length ; i++) {
        formData.append('photos', photos[i]);
      }
      formData.append('title', title);
      formData.append('location', location);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('userId', userId);

      axios
        .post('/api/products/addProduct', formData)
        .then(res => {
          props.setErrors({});
          props.setShowModal(false)
          axios
            .get('/api/products/getAll')
            .then(res => dispatch(getAllProducts(res.data)));
          props.history.push(`/products/${res.data._id}`)
        })
        .catch(err => 
          props.setErrors(err.response.data)
        );
    }
    else
      if(props.isOpen){
        props.setErrors({})
        props.setShowModal(false)
        props.history.push('/Login')
      }
  }

  const deletePhoto = i => {
    const photoNumber = i;
    setPhotos(photos.filter((photo, i) => i !== photoNumber));
    setPhotosPreview(photosPreview.filter((photo, i) => i !== photoNumber))
  }

  return (
      <form
        onSubmit={onSubmit}
        noValidate
      >
        <p style={{fontSize: '19px', textAlign: 'center'}}>Add product</p>
        <FormInput
          labelName='TITLE'
          name='title'
          type='input'
          handleInputChange={handleInputChange}
          placeholder='For example: Iron man suit'
          errors={props.errors.title}
        />
        <FormInput 
          labelName='LOCATION'
          name='location'
          type='input'
          handleInputChange={handleInputChange}
          placeholder='For example: Los Angeles, CA'
          errors={props.errors.location}
        />
        <FormInput 
          labelName='DESCRIPTION'
          name='description'
          type='input'
          handleInputChange={handleInputChange}
          height={4}
        />
        <PhotosInput 
          component={props.component}
          photosPreview={photosPreview}
          addPhotos={addPhotos}
          deletePhoto={deletePhoto}
        />
        <FormInput 
          labelName='PRICE'
          name='price'
          type='input'
          handleInputChange={handleInputChange}
          errors={props.errors.price}
        />
        <div>
          <button
            type='submit'
          >
            SUBMIT
          </button>
        </div>
      </form>
  )
}

export default withRouter(SellProductInputs);