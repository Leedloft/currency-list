import * as React from 'react';
import Button from '@mui/material/Button';
import styles from './style.module.css';

export default function DisableElevation() {
    return (
            <Button className={styles.button1} variant="contained" disableElevation>
                Convert
            </Button>
    );
}