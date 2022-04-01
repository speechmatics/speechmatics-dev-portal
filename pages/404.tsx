

export default function Custom404() {
  return <div
    style={{ "color": "#000", "background": "#fff", "fontFamily": "-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI',\n          'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif", "height": "100vh", "textAlign": "center", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "width": "100%" }}
  >
    <div style={{ "display": "flex", "alignItems": "center" }}>

      <h1
        style={{ "display": "inline-block", "borderRight": "1px solid rgba(0, 0, 0, 0.3)", "fontSize": "24px", "fontWeight": "500", "verticalAlign": "top", "paddingRight": "18px" }}
      >
        404
      </h1>
      <div
        style={{ "display": "inline-block", "textAlign": "left", "lineHeight": "49px", "height": "49px", "verticalAlign": "middle" }}
      >
        <h2
          style={{ "fontSize": "14px", "fontWeight": "normal", "lineHeight": "inherit", "margin": "0", "padding": "0", "paddingLeft": "18px" }}
        >
          This page could not be found
        </h2>
      </div>
    </div>
  </div>
}
