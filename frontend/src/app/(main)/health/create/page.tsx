"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  lab_no: z.string().min(1, "กรอก Lab No."),
  test_date: z.string().min(1, "กรอกวันที่ตรวจ"),
  creatinine: z.number().min(1, "กรอก Creatinine"),
  egfr: z.number().min(1, "กรอก eGFR"),
  protein: z.string().min(1, "กรอก Protein"),
  blood: z.number().min(1, "กรอก Blood"),
  bacteria: z.number().min(1, "กรอก Bacteria"),
});

type Inputs = z.infer<typeof formSchema>;

export default function CreateHealthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lab_no: "",
      test_date: "",
      creatinine: 0,
      egfr: 0,
      protein: "",
      blood: 0,
      bacteria: 0,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  console.log(errors);
  return (
      <Container>
      <Typography sx={{ mb: 2 }} variant="h4" component="h1">
          Create Health Record
        </Typography>
      <Box component="section" sx={{ p: 2, border: '1px solid grey', borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Lab No."
              variant="outlined"
              {...register("lab_no")}
              error={Boolean(errors.lab_no)}
              helperText={errors.lab_no?.message}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Test Date"
              type="date"
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }} 
              {...register("test_date")}
              error={Boolean(errors.test_date)}
              helperText={errors.test_date?.message}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="h4" component="h1">
              Blood Test
            </Typography>
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="Creatinine"
              variant="outlined"
                {...register("creatinine", { valueAsNumber: true })}
              error={Boolean(errors.creatinine)}
              helperText={errors.creatinine?.message}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              fullWidth
              label="eGFR"
              variant="outlined"
              {...register("egfr", { valueAsNumber: true })}
              error={Boolean(errors.egfr)}
              helperText={errors.egfr?.message}
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="h4" component="h1">
              Urine Test
            </Typography>
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Protein"
              variant="outlined"
              {...register("protein")}
              error={Boolean(errors.protein)}
              helperText={errors.protein?.message}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Blood"
              variant="outlined"
              {...register("blood", { valueAsNumber: true })}
              error={Boolean(errors.blood)}
              helperText={errors.blood?.message}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Bacteria"
              variant="outlined"
              {...register("bacteria", { valueAsNumber: true })}
              error={Boolean(errors.bacteria)}
              helperText={errors.bacteria?.message}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth sx={{ mt: 2 }} variant="contained" color="primary">Save</Button>
        </form>
      </Box>

      </Container>
  );
}