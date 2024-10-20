import Box from '@mui/material/Box'; // Using Material-UI for styling

export default function CircularLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.3); /* Light color for the border */
          border-top: 8px solid #0a66c2; /* Main color for the top border */
          border-radius: 50%;
          width: 60px; /* Size of the loader */
          height: 60px; /* Size of the loader */
          animation: spin 1s linear infinite; /* Spinning animation */
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
}
