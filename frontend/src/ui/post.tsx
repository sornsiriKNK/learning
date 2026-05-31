import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { Post as PostType } from "@/lib/posts";

type PostProps = {
  post: PostType;
};

export function Post({ post }: PostProps) {
  return (
    <Box component="li" sx={{ mb: 2, listStyle: "none" }}>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {post.createdAt}
        </Typography>
        <Typography variant="body1">{post.content}</Typography>
      </Paper>
    </Box>
  );
}
