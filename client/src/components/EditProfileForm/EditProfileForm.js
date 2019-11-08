import React, { useState, useEffect } from 'react';
import FormInput from '../FormInput/FormInput';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { setCurrentUser } from '../../store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from '../../constants/isEmpty';
import './EditProfileForm.scss';

const EditProfileForm = props => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState({});
  const [photoPreview, setPhotoPreview] = useState({});
  const [errors, setErrors] = useState({});

  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setPhotoPreview(user.photo);
  }, [])

  const handleInputChange = e => {
    const target = e.target;
    target.name === 'name' ? 
      setName(target.value) : 
      setPhoneNumber(target.value);
  }

  const addPhoto = e => {
    let file = e.target.files[0];
    let reader = new FileReader();
    setAvatar(file);
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    }
    reader.readAsDataURL(file);
  }

  const onSubmit = e => {
    e.preventDefault();
    if(photoPreview === user.photo && isEmpty(phoneNumber) && isEmpty(name)){
      let errors = {};
      errors.empty = 'Please, fill Full Name or Phone Number field, or just change the avatar'
      setErrors(errors);
    } else {
      const formData = new FormData();
      formData.append('avatar', photoPreview === user.photo? null : avatar);
      formData.append('name', name);
      formData.append('phoneNumber', phoneNumber);
      formData.append('userId', user.id);

      axios
        .post('/api/users/updateUserInfo', formData)
        .then(res => {
          const { token } = res.data;
          localStorage.setItem('jwtToken', token);
          const decoded = jwt_decode(token);
          dispatch(setCurrentUser(decoded));
        })
        .then(setErrors({}))
        .catch(err => 
          setErrors(err.response.data)
        );
    }
  }

  return (
      <form
        onSubmit={onSubmit}
        noValidate
        className='edit-profile-form'
      >
        <p style={{fontSize: '19px', textAlign: 'center'}}>Edit Profile</p>
        <div className='round'>
          <label htmlFor='avatar'>
            <img src={photoPreview}/>
            <input
              type='file'
              id='avatar'
              name='avatar'
              onChange={e => addPhoto(e)}
              accept='image/png, image/jpeg, image/jpg'
            />
          </label>
          <label className='upgrade-photo-button' htmlFor='avatar'>
            Upgrade Photo
          </label>
        </div>
        <FormInput
          labelName='FULL NAME'
          name='name'
          type='input'
          handleInputChange={handleInputChange}
          placeholder={user.name}
          errors={errors.name}
        />
        <FormInput 
          labelName='PHONE NUMBER'
          name='phoneNumber'
          type='input'
          handleInputChange={handleInputChange}
          errors={errors.phoneNumber}
          phoneNumber={phoneNumber}
        />
        {errors.empty && 
        <p style={{fontSize: '12px', color: 'red'}}>
          {errors.empty}
        </p>
        }
        <div>
          <button
            type='submit'
            style={{background: '#349A89', borderRadius: '5px', border: 'none', color: 'white', height: '35px'}}
          >
            SAVE
          </button>
        </div>
      </form>
  )
}

export default EditProfileForm;