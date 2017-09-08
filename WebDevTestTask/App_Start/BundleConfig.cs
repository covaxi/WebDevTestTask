using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace WebDevTestTask
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery/jquery-{version}.js",
                    "~/Scripts/jquery/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/react").Include(
                    "~/Scripts/react/react.js",
                    "~/Scripts/react/react-dom.js",
                    "~/Scripts/react/react-draggable.js"));

            bundles.Add(new ScriptBundle("~/bundles/controls").Include(
                    "~/Scripts/controls.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/site.css"));
        }
    }
}