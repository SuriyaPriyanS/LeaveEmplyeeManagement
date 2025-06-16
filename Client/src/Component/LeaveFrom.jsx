import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid } from '@mui/material';

const LeaveForm = () => {
    const formik = useFormik({
        initialValues: {
            employeeName: '',
            leaveType: '',
            startDate: '',
            endDate: '',
            reason: '',
        },
        validationSchema: Yup.object({
            employeeName: Yup.string().required('Required'),
            leaveType: Yup.string().required('Required'),
            startDate: Yup.date().required('Required').nullable(),
            endDate: Yup.date().required('Required').nullable(),
            reason: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            // Handle form submission, e.g., send data to the backend
            console.log('Form data', values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="employeeName"
                        name="employeeName"
                        label="Employee Name"
                        value={formik.values.employeeName}
                        onChange={formik.handleChange}
                        error={formik.touched.employeeName && Boolean(formik.errors.employeeName)}
                        helperText={formik.touched.employeeName && formik.errors.employeeName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="leaveType"
                        name="leaveType"
                        label="Leave Type"
                        value={formik.values.leaveType}
                        onChange={formik.handleChange}
                        error={formik.touched.leaveType && Boolean(formik.errors.leaveType)}
                        helperText={formik.touched.leaveType && formik.errors.leaveType}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="startDate"
                        name="startDate"
                        label="Start Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                        helperText={formik.touched.startDate && formik.errors.startDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="endDate"
                        name="endDate"
                        label="End Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && formik.errors.endDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="reason"
                        name="reason"
                        label="Reason for Leave"
                        multiline
                        rows={4}
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        error={formik.touched.reason && Boolean(formik.errors.reason)}
                        helperText={formik.touched.reason && formik.errors.reason}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Submit Leave Request
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default LeaveForm;