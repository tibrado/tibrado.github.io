import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Rating } from '@mui/material';
import { Logout, Send } from '@mui/icons-material';
import { PostFeedback } from '../handlers/ApiHandler';

type Props = {
  text?: string;
};

const Done: React.FC<Props> = ({ text = "Exit" }) => {

  const handleClose = () => {
    window.close();
    setTimeout(() => {
      window.location.href = "about:blank";
    }, 100);
  };

  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ rating, feedback });
  };

  return (

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
            display: 'inline-block',
            maxWidth: 500,
            width: '100%',
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Thank you for participating!
        </Typography>
        <Typography variant="body2" color="text.secondary">
            We are currently in our beta phase and constantly evolving. Your insights are incredibly valuable to us. If you successfully uncovered a prize today, congratulations and enjoy your reward!
        </Typography>

        {/* Rating Section */}
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography component="legend" variant="body1" fontWeight="medium">
                How would you rate your experience?
            </Typography>
            <Rating
                name="scavenger-rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
            />
        </Box>

        {/* Written Feedback Input */}
        <TextField
            label="Share your feedback or ideas to help us improve"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you love? What can we change?"
            sx={{ mb: 3 }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
                startIcon={<Logout />}
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                size="large"
            >
                {text || 'Exit'}
            </Button>
            <Button
                type="submit"
                endIcon={<Send />}
                variant="contained"
                color="success"
                size="large"
                onClick={() => {
                    PostFeedback(feedback, rating ?? 0);
                    handleClose();
                }}
                disabled={!rating && !feedback.trim()}
            >
                Submit
            </Button>
        </Box>
      </Box>
    );
};

export default Done;