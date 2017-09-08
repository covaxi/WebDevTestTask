using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Web;

namespace WebDevTestTask
{
    public class Constants
    {
        public const int Width = 640;
        public const int Height = 480;
        public const int Radius = 20;
        public const int DotRadius = 5;

        public const string Value = "Value";

        public static readonly string[] Colors = new[] { "red", "green", "blue", "yellow" };
    }
}