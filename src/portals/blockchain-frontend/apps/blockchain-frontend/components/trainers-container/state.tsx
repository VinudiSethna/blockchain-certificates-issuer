import { createTrainer, deleteById, getTrainers } from "apps/blockchain-frontend/api/fetchData";
import { TrainerRequest, TrainerResponse } from "apps/blockchain-frontend/interfaces/viewModels";
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { DefaultPagination } from "apps/blockchain-frontend/interfaces/enums";
import { Modal, message } from "antd";
import {ExclamationCircleOutlined } from '@ant-design/icons/lib/icons';

export function useComponentState() {
    const [dataSource, setDataSource] = useState([]);
  
    const createNewTrainer = async (values) => {
      let trainer: TrainerRequest = {
          FirstName : values.firstName,
          LastName : values.lastName,
          EmailAddress : values.emailAddress
      };
      const trainerRes = await createTrainer(trainer);
      if(trainerRes){
        message.success(`Trainer created successfully`);
        fetchTrainers(DefaultPagination.pageNumber, DefaultPagination.pageSize);
        clearForm();
      }else{
        message.success(`Failed to create the course`);
      }
    };
  
    const validate = (values) => {
      const errors: {
        firstName?: string;
        lastName?: string;
        emailAddress?: string;
      } = {};
  
      if (!values.firstName) {
        errors.firstName = 'Required';
      } 
  
      if (!values.lastName) {
        errors.lastName = 'Required';
      }
  
      if (!values.emailAddress) {
        errors.emailAddress = 'Required';
      }
  
  
      return errors;
    };
  
    const formik = useFormik({
      initialValues: {
        firstName: '',
        lastName: '',
        emailAddress: '',
      },
      validate,
      onSubmit: createNewTrainer,
    });
  
    const fetchTrainers = async (pageNumber: number, pageSize: number) => {
      let trainerRes: TrainerResponse[]= [await getTrainers(pageNumber, pageSize)];
      if (Array.isArray(trainerRes)) {
        trainerRes = trainerRes.flat();
      }
      const formattedData = trainerRes.map((item) => {
        return { ...item,key : item.Id};
      });
      setDataSource(formattedData);
 
    };
    useEffect(() => {
      fetchTrainers(DefaultPagination.pageNumber, DefaultPagination.pageSize);
    }, []);
  
    const handleDelete =( itemName, id) => {
      Modal.confirm({
        title: `Are you sure you want to delete this ${itemName}?`,
        icon: <ExclamationCircleOutlined />,
        onOk() {
        deleteById(id,itemName).then((success) => {
            if (success) {
              message.success(`${itemName} deleted successfully`);
              fetchTrainers(DefaultPagination.pageNumber, DefaultPagination.pageSize);
            } else {
              message.error(`Failed to delete ${itemName}`);
            }
          });
        },
        onCancel() { },
      });
    }  
    
    const clearForm = () => {
      formik.resetForm();
    };
    return { formik, handleDelete, dataSource, fetchTrainers };
  }
