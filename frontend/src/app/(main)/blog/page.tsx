import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getPosts } from "@/lib/posts";
import { Post } from "@/ui/post";

export default async function Page() {
  const posts = await getPosts();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Blog
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {posts.length} posts
      </Typography>
      <Box component="ul" sx={{ m: 0, p: 0 }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Container>
  );
}
