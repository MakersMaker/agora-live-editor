import color from "@material-ui/core/colors/yellow";

const port = process.env.PORT || 8081;

export const server = {
  port,
  host: '',
};

export const style = {
  page: {
    height: 'calc(80vh - 48px)'
  },
  wrapconsole: {
    height: 'calc(20vh)',
    background : '#fbc'
  }
}
