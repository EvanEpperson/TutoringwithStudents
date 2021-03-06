const express = require('express');
const Student = require('../models/student.js')
const student = express.Router()
// for users to have to log in 
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/users/new");
  }
};

// trying redirect routes , only test for now 
const testing = (req, res, next ) => {
  if(!req.session.currentUser){
    req.session.redirectTo = '/student'
    res.redirect('/users/new')
  } else {
    next();
  }
}
// admin middleware so you have to be an admin to go to these specific pages 
const admin = (req, res, next) => {
  if(req.session.currentAdmin){
    return next();
  }else{
    res.redirect('/adminsessions/new')
    // put it to a new folder to fill out for admins to edit things around 
  }
}
// making a new student with show page also only admin 
student.get("/new",  (req, res) => {
  res.render("student/studentnew.ejs", { currentUser: req.session.currentUser });
});

// delete also only seen by admin with the if else on show page 
student.delete('/:id', (req, res) => {
  Student.findByIdAndRemove(req.params.id, (error, deletedstudent) => {
    res.redirect('/student')
  })
})
// first update route to actually update, this is only seen by admin and is on the student show page also with if else 
student.put('/:id', admin, (req, res) => {
  Student.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, foundStudent) => {
    res.redirect('/student')
  })
})
// teacher request form that will let you email me about becoming a student teacher 
student.get('/teacherrequest', (req, res) => {
  res.render('student/teacherRequest.ejs')
})
// this is the request form that everyone can see that will bring you to the email form i have 
student.get('/editrequestform', (req, res) => {
  res.render('student/studentContact.ejs', 
  {
    currentAdmin: req.session.currentAdmin
  })
})
// student edit page , should only be seen by admin and thats on the student show page .ejs 
student.get('/:id/edit', admin, (req, res) => {
  Student.findById(req.params.id, (error, foundStudent) => {
    res.render('student/studentedit.ejs', 
    { 
      data: foundStudent,
      currentUser: req.session.currentUser,
      currentAdmin: req.session.currentAdmin
    })
  })
})
// Main Student page , Index you need authorization to access this page 
student.get("/", isAuthenticated, (req, res) => {
  Student.find({}, (err, allStudents) => {
    res.render("student/studentindex.ejs", {
      data: allStudents,
      currentUser: req.session.currentUser,
      currentAdmin: req.session.currentAdmin,
    });
  });
});

// show page for students 
student.get('/:index', (req, res) => {
    Student.findById(req.params.index, (err, allStudents) => {
        res.render('student/studentshow.ejs', {
            data: allStudents,
            currentUser: req.session.currentUser,
            currentAdmin: req.session.currentAdmin
        })
    })
})
// route to create another student , only have this for students because we can't create another Main Teacher 
student.post('/', (req, res) => {
  Student.create(req.body, (error, createdStudent ) => {
    res.redirect('/student')
  })
})




// student.get("/setup/seed", (req, res) => {
//   Student.create(
//     [
//       {
//         firstName: "Banu",
//         lastName: "Tryon",
//         specializations:
//           "Made the World Beatufiul with CSS, Then Commented it Out",
//         phone: "225",
//         email: "nothing yet",
//         time: "West Coast",
//         image:
//           "https://media-exp1.licdn.com/dms/image/C5603AQErZ1mG03VOuA/profile-displayphoto-shrink_800_800/0/1607619551717?e=1614816000&v=beta&t=Ds35diTR9tELCR4egU3xZD00QKuOZKMdhrNjpCZnhE4",
//         imageupload: " ",
//         imagea:
//           "https://miro.medium.com/max/2560/1*v0VfsQyWTJ-5eOo5kcjfLg@2x.jpeg",
//         imageb: "https://media0.giphy.com/media/XZYR46vpHwqvYdjVMm/giphy.gif",
//         linkedin: "https://www.linkedin.com/in/tryon-experiences"
//       },
//       {
//         firstName: "AJ",
//         lastName: "Good Luck",
//         specializations:
//           "Created Linux, then let Linus Torvalds take the credit",
//         phone: "224",
//         email: "nothing yet ",
//         time: "East Coast",
//         image:
//           "https://media-exp1.licdn.com/dms/image/C5103AQGfVPKYLl3uTw/profile-displayphoto-shrink_800_800/0/1516353900370?e=1614816000&v=beta&t=ElC4bhCKOp74KVKgqEUPVrmHOHhXXpVOEIZfC-oYk5Q",
//         imagea:
//           "https://upload.wikimedia.org/wikipedia/commons/9/9f/Vimlogo.svg",
//         imageb:
//           "https://steamuserimages-a.akamaihd.net/ugc/518259462797828234/08E759FF7914A201100BA0A31FC4940022D09EE5/",
//         linkedin: "https://www.linkedin.com/in/ajigh/",
//       },
//       {
//         firstName: "Anthony",
//         lastName: "Ku",
//         specializations: "All Around Monster, Literal God Among Meir Mortals",
//         phone: "223",
//         email: "nothing yet",
//         time: "east Coast",
//         image:
//           "https://media-exp1.licdn.com/dms/image/C5603AQHNoePwicZHUQ/profile-displayphoto-shrink_800_800/0/1607029530909?e=1614816000&v=beta&t=yMzTg39Qt_vni0gEPlqT38Jg0fKtw32txmOhu4LYQCg",
//         imagea:
//           "https://i.pinimg.com/originals/24/0b/bb/240bbb8b6e90cb1a0ac5165c2dd6fc27.jpg",
//         imageb:
//           "https://media.tenor.com/images/6e7c95cea52bcc146ac671742c8f1ad5/tenor.gif",
//         linkedin: "https://www.linkedin.com/in/anthonyycku/",
//       },
//       {
//         firstName: "Malik",
//         lastName: "Ajose",
//         specializations: "The CEO, Your not fooling anyone",
//         phone: "222",
//         email: "nothing yet",
//         time: "West Coast",
//         image:
//           "https://media-exp1.licdn.com/dms/image/C5603AQFCBwYW9QawVA/profile-displayphoto-shrink_800_800/0/1606690666214?e=1614816000&v=beta&t=YdOyA8Odc9TvuSYqBy250rur-jOc50WSWqAHTK2BjXM",
//         imagea:
//           "https://www.tvovermind.com/wp-content/uploads/2017/01/UndercoverBoss.jpg",
//         imageb:
//           "https://i.pinimg.com/originals/78/b9/cc/78b9cc43706c49fadf85fee50243ed47.gif",
//         linkedin: "https://www.linkedin.com/in/ajose-malik/",
//       },
//       {
//         firstName: "Hunter",
//         lastName: "Wallen",
//         specializations:
//           "Master of all things JS. Don't ask any questions before he's had his coffee.",
//         phone: "222",
//         email: "nothing yet",
//         time: "East Coast",
//         image:
//           "https://media-exp1.licdn.com/dms/image/C5603AQGbZY3OCY0lKQ/profile-displayphoto-shrink_800_800/0/1607033788620?e=1614816000&v=beta&t=f4JO0qLiEPrg-ikeLgCmTxVwtlTnWpBi9kF5rtIk3OY",
//         imagea: "https://cdn.mos.cms.futurecdn.net/EzgdmaCQuT84bgDL4fhXZS.jpg",
//         imageb: "https://media1.giphy.com/media/TI32JwHmWQEi4/giphy.gif",
//         linkedin: "https://www.linkedin.com/in/hunter-wallen/",
//       },
//     ],
//     (err, data) => {
//       res.redirect("/student");
//     }
//   );
// });
























module.exports = student