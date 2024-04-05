import { makeStyles } from "@mui/styles";

// import backgroundImage from 'assets/transparent-pixel.png'
// import background from 'assets/transparent-pixel.png'

const useStyles = makeStyles(() => ({
  Media: {
    height: "100%",
    width: "100%",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    // backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  mainWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 50px)",
  },

  paperWrapper: {
    padding: "30px",
    minHeight: "500px",
    "@media (min-width: 1000px)": {
      maxHeight: "500px",
      maxWidth: "750px",
      height: "500px",
      width: "750px",
      // backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
    },
  },

  logoImage: {
    width: "25px",
    marginLeft: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },

  formBox: {
    width: "290px",
  },

  formTitle: {
    lineHeight: 1,
    marginTop: 0,
  },

  linearProgress: {
    marginTop: "20px",
  },

  alert: {
    marginTop: "20px",
    padding: "1px 16px 1px 16px",
  },

  footer: {
    marginTop: "auto",
    backgroundColor: "#E7EAED",
    padding: "10px 10px 15px 10px",
  },

  signupLink: {
    textAlign: "right",
  },
}));

export { useStyles };
