using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace WebDevTestTask.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Constants()
        {
            var constants = typeof(Constants)
                .GetFields()
                .ToDictionary(x => x.Name, x => x.GetValue(null));
            var json = new JavaScriptSerializer().Serialize(constants);
            return JavaScript("var constants = " + json + ";");
        }
    }
}