import React, { FC } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import _ from 'lodash';

export interface IMessage {
  title: string;
  message: string;
}

export interface IAlert {
  type: AlertColor;
  message: IMessage | string;
}

export interface ICustomAlerts {
  open: boolean;
  autoHideDuration: number;
  alert: IAlert;
}

export const initialState: ICustomAlerts = {
  open: false,
  autoHideDuration: 6000,
  alert: {
    type: 'warning',
    message: ''
  }
};

interface IProps {
  params: ICustomAlerts;
  closeAlert: () => void;
}

/**
 *
 * @param props
 * @var type: 'success' | 'info' | 'warning' | 'error'
 * @property open={open} autoHideDuration={6000} onClose={handleClose}
 * @returns
 */
const CustomAlerts: FC<IProps> = (props: IProps) => {
  const handleMessage = (): string => {
    return _.isObject(props.params.alert.message)
      ? `${
          !_.isNil(props.params.alert.message.title)
            ? props.params.alert.message.title
            : ''
        } - ${
          !_.isNil(props.params.alert.message.message)
            ? props.params.alert.message.message
            : ''
        }`
      : props.params.alert.message;
  };

  return (
    <Snackbar
      open={props.params.open}
      autoHideDuration={props.params.autoHideDuration}
      onClose={props.closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={props.closeAlert}
        severity={props.params.alert.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {handleMessage()}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlerts;