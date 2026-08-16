namespace WebApplication1.Security
{
    /// <summary>
    /// Marks a controller action as requiring a specific RBAC permission.
    /// Enforcement is performed server-side by <see cref="PermissionValidationMiddleware"/>
    /// (see Program.cs), which reads this attribute from the matched endpoint metadata.
    /// This replaces the previous client-supplied ?permission= query-string check,
    /// which could be bypassed by simply omitting the query parameter.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public sealed class RequirePermissionAttribute : Attribute
    {
        public string Permission { get; }

        public RequirePermissionAttribute(string permission)
        {
            Permission = permission;
        }
    }
}
