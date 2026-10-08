import { useEffect, useState } from "react";

import { getAssets } from "../services/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Laptop } from "lucide-react";


function AssetsPage() {

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadAssets = async () => {

            try {

                const data = await getAssets();

                setAssets(data);

            } catch (error) {

                console.error(
                    "Unable to load assets:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadAssets();

    }, []);


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold text-black">
                    Assets
                </h1>

                <p className="text-muted-foreground">
                    Hardware and managed assets associated with incidents.
                </p>

            </div>


            <Card>

                <CardHeader>

                    <CardTitle className="flex items-center gap-2">

                        <Laptop className="size-5" />

                        Asset Inventory

                    </CardTitle>

                </CardHeader>


                <CardContent>

                    {loading ? (

                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Loading assets...
                        </p>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-sm">

                                <thead className="border-b">

                                    <tr>

                                        <th className="px-3 py-3 text-left">
                                            Asset Tag
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Type
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Model
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Purchase Date
                                        </th>

                                        <th className="px-3 py-3 text-left">
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {assets.map(
                                        (asset) => (

                                            <tr
                                                key={
                                                    asset.asset_id
                                                }
                                                className="border-b last:border-0"
                                            >

                                                <td className="px-3 py-3 font-medium">
                                                    {asset.asset_tag}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {asset.asset_type}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {asset.model || "—"}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {asset.purchase_date || "—"}
                                                </td>

                                                <td className="px-3 py-3">

                                                    <Badge variant="outline">
                                                        {asset.status}
                                                    </Badge>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </CardContent>

            </Card>

        </div>

    );

}


export default AssetsPage;