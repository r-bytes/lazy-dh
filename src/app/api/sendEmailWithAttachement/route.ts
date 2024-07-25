import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const send = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { content, filename } = req.body;

  const resend = new Resend(process.env.RESEND_API_KEY);

  switch (method) {
    case "POST": {
      const { data } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "Email with attachment",
        html: "<p>See attachment</p>",
        attachments: [
          {
            content,
            filename,
          },
        ],
      });

      return res.status(200).send({ data: data?.id });
    }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default send;


// todo
//   const [content, setContent] = React.useState(null);
//   const [filename, setFilename] = React.useState('');

//   const onSubmit = async (e: React.FormEvent) => {
//   };

//   const onAddFileAction = (e) => {
//     const reader = new FileReader();
//     const files = e.target.files;

//     reader.onload = (r) => {
//       setContent(r.target.result.toString());
//       setFilename(files[0].name);
//     };

//     reader.readAsDataURL(files[0]);
//   };

//   return (
//     <form
//       onSubmit={onSubmit}
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '20px',
//         width: 200,
//       }}
//     >
//       <input
//         type="file"
//         name="file"
//         onChange={onAddFileAction}
//         accept="image/*"
//       />
//       <input type="submit" value="Send Email" />
//     </form>
//   );
// };
