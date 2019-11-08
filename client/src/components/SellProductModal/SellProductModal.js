import React, { useState } from 'react';
import './SellProductModal.scss';
import ReactModal from 'react-modal';
import SellProductInputs from '../SellProductInputs/SellProductInputs';
import CloseIcon from '@material-ui/icons/Close';
import { setModal } from '../../store/actions/actions';
import { useDispatch } from 'react-redux';

ReactModal.setAppElement(document.getElementById('root'))

const SellProductModal = props => {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
 
  return (
    <ReactModal
      isOpen={props.showModal}
      className='sell-product-modal'
      overlayClassName='overlay'
      onAfterClose={() => {dispatch(setModal()); setErrors({})}}
      onAfterOpen={() => dispatch(setModal())}
    > 
      <CloseIcon 
        style={{ position: 'absolute', fontSize: '2vw', right:'5px', top:'5px', cursor: 'pointer'}}
        onClick={() => props.setShowModal(false)}
      />
      <SellProductInputs 
        component='SellProductModal'
        errors={errors}
        setErrors={setErrors}
        setShowModal={props.setShowModal}
        isOpen={props.showModal}
      />
    </ReactModal>
  )
}

export default SellProductModal;