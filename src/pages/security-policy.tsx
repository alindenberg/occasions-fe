import Head from 'next/head';

export default function SecurityPolicy() {
    return (
        <>
            <Head>
                <title>Security Policy | Occasion Alerts</title>
                <meta name="description" content="Security policy for Occasion Alerts" />
            </Head>
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Security Policy</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Reporting Security Issues</h2>
                    <p className="mb-4">
                        We take the security of our website seriously. If you believe you&apos;ve found a security vulnerability,
                        please email us at <a href="mailto:support@mg.occasionalerts.com" className="text-blue-600 hover:underline">support@mg.occasionalerts.com</a>.
                    </p>
                    <p>
                        We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge
                        your contribution.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
                    <p className="mb-4">
                        We implement reasonable security measures to protect your personal information from unauthorized access,
                        disclosure, alteration, and destruction.
                    </p>
                    <p>
                        Your data is encrypted in transit using TLS and we follow industry best practices for data storage and protection.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                    <p>
                        We may use third-party services for authentication and other features. These services have their own
                        privacy policies and security measures. We carefully select our partners to ensure they maintain high
                        security standards.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                    <p>
                        We may update this security policy from time to time. Any changes will be posted on this page.
                    </p>
                </section>
            </main>
        </>
    );
}