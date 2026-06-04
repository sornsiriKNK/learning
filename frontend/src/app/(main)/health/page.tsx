import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Link from "next/link";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const tableHeader = [
  { label: 'Dessert (100g serving)', align: 'left' },
  { label: 'Calories', align: 'right' },
  { label: 'Fat&nbsp;(g)', align: 'right' },
  { label: 'Carbs&nbsp;(g)', align: 'right' },
  { label: 'Protein&nbsp;(g)', align: 'right' },
] as const;

export default function HealthPage() {
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={10}>
          <Typography variant="h4" component="h1">
            Health
          </Typography>
        </Grid>
        <Grid size={2}>
          <Link href="/health/create" style={{ display: "block", width: "100%", textDecoration: "none" }}>
            <Button variant="contained" fullWidth>
              New Record
            </Button>
          </Link>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650, border: '1px solid #000', borderRadius: 1 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableHeader.map((item) => (
                <TableCell
                  key={item.label}
                  sx={{ backgroundColor: 'red' }}
                  align={item.align}
                >
                  {item.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
