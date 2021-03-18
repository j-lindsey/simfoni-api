var filepath = '~/C:\db\Building2.jpg'

app.get('/path/for/site', function (req, res) {
    res.sendFile(filepath);
})


private void Page_Load(object sender, System.EventArgs e)
{
string imgid =Request.QueryString["imgid"];
string connstr=((NameValueCollection)
Context.GetConfig("appSettings"))["connstr"];
string sql="SELECT imgdata, imgtype FROM ImageStore WHERE id = "
+ imgid;
SqlConnection connection = new SqlConnection(connstr);
SqlCommand command = new SqlCommand(sql, connection);
connection.Open();
SqlDataReader dr = command.ExecuteReader();
if(dr.Read())
{
	Response.ContentType = dr["imgtype"].ToString();
	Response.BinaryWrite( (byte[]) dr["imgdata"] );
}
connection.Close();
}
/*
Building2.jpg

var multer = require('multer');

 var upload = multer({
 limits: {
  fileSize: 1000000
}
});

 app.post('/upload', upload.single('file'), async (req, res) => {
 try {
 const file = {
  file: req.file.buffer,
  filename: req.file.originalname,
  mimetype: req.file.mimetype
};
// console.log(req.file.buffer.toString('base64'));
const product = new Product({ ...req.body });
product.images = [file];
await product.save();
res.status(201).send({ success: true, product });
...

app.get('/api/products/:id', async (req, res) => {
try {
const product = await Product.findById({ _id: req.params.id }).populate(
  'brand'
);

if (!product) {
  throw new Error('Cannot find the requested product');
}
res.send({ product });
....*/