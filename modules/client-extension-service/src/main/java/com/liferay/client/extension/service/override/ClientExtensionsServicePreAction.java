/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.client.extension.service.override;

import com.liferay.client.extension.constants.ClientExtensionEntryConstants;
import com.liferay.client.extension.model.ClientExtensionEntryRel;
import com.liferay.client.extension.service.ClientExtensionEntryRelLocalService;
import com.liferay.client.extension.type.CET;
import com.liferay.client.extension.type.ThemeCSSCET;
import com.liferay.client.extension.type.ThemeFaviconCET;
import com.liferay.client.extension.type.ThemeJSCET;
import com.liferay.client.extension.type.ThemeSpritemapCET;
import com.liferay.client.extension.type.manager.CETManager;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.events.Action;
import com.liferay.portal.kernel.events.LifecycleAction;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.LayoutSet;
import com.liferay.portal.kernel.service.LayoutLocalService;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.Constants;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;

import java.util.Date;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Eudaldo Alonso
 * @author Allen Ziegenfus
 */
@Component(
	property = "key=servlet.service.events.pre", service = LifecycleAction.class
)
public class ClientExtensionsServicePreAction extends Action {

	@Override
	public void run(
		HttpServletRequest httpServletRequest,
		HttpServletResponse httpServletResponse) {

		ThemeDisplay themeDisplay =
			(ThemeDisplay)httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		Layout layout = themeDisplay.getLayout();

		if (layout.isTypeControlPanel()) {
			String mode = ParamUtil.getString(
				httpServletRequest, "p_l_mode", Constants.VIEW);

			if (!Objects.equals(mode, Constants.PREVIEW)) {
				return;
			}

			long selPlid = ParamUtil.getLong(
				httpServletRequest,
				StringBundler.concat(
					StringPool.UNDERLINE,
					ParamUtil.getString(httpServletRequest, "p_p_id"),
					"_selPlid"));

			if (selPlid <= 0) {
				return;
			}

			layout = _layoutLocalService.fetchLayout(selPlid);
		}

		if (layout == null) {
			return;
		}

		themeDisplay.setFaviconURL(_getFaviconURL(layout));

		ThemeCSSCET themeCSSCET = _getThemeCSSCET(layout);

		if (themeCSSCET != null) {
			Date now = new Date();

			long timestamp = now.getTime();

			Date modifiedDate = themeCSSCET.getModifiedDate();

			if (modifiedDate != null) {
				timestamp = modifiedDate.getTime();
			}

			themeDisplay.setClayCSSURL(
				themeCSSCET.getClayURL() + "?t=" + timestamp);
			themeDisplay.setMainCSSURL(
				themeCSSCET.getMainURL() + "?t=" + timestamp);
		}

		ThemeSpritemapCET themeSpritemapCET = _getThemeSpritemapCET(layout);

		if (themeSpritemapCET != null) {
			themeDisplay.setPathThemeSpritemap(themeSpritemapCET.getURL());
		}

		ThemeJSCET themeJSCET = _getThemeJSCET(layout);

		if (themeJSCET != null) {
			themeDisplay.setMainJSURL(themeJSCET.getURL());
		}
	}

	private CET _getCET(
		long classNameId, long classPK, long companyId, String type) {

		ClientExtensionEntryRel clientExtensionEntryRel =
			_clientExtensionEntryRelLocalService.fetchClientExtensionEntryRel(
				classNameId, classPK, type);

		if (clientExtensionEntryRel == null) {
			return null;
		}

		return _cetManager.getCET(
			companyId, clientExtensionEntryRel.getCETExternalReferenceCode());
	}

	private String _getFaviconURL(Layout layout) {
		String faviconURL = _getThemeFaviconCETURL(
			_portal.getClassNameId(Layout.class), layout.getPlid(),
			layout.getCompanyId());

		if (Validator.isNotNull(faviconURL)) {
			return faviconURL;
		}

		faviconURL = layout.getFaviconURL();

		if (Validator.isNotNull(faviconURL)) {
			return faviconURL;
		}

		Layout masterLayout = _layoutLocalService.fetchLayout(
			layout.getMasterLayoutPlid());

		if (masterLayout != null) {
			faviconURL = _getThemeFaviconCETURL(
				_portal.getClassNameId(Layout.class), masterLayout.getPlid(),
				layout.getCompanyId());

			if (Validator.isNotNull(faviconURL)) {
				return faviconURL;
			}

			faviconURL = masterLayout.getFaviconURL();

			if (Validator.isNotNull(faviconURL)) {
				return faviconURL;
			}
		}

		LayoutSet layoutSet = layout.getLayoutSet();

		faviconURL = _getThemeFaviconCETURL(
			_portal.getClassNameId(LayoutSet.class), layoutSet.getLayoutSetId(),
			layout.getCompanyId());

		if (Validator.isNotNull(faviconURL)) {
			return faviconURL;
		}

		faviconURL = layoutSet.getFaviconURL();

		if (Validator.isNotNull(faviconURL)) {
			return faviconURL;
		}

		return null;
	}

	private ThemeCSSCET _getThemeCSSCET(Layout layout) {
		CET cet = _getCET(
			_portal.getClassNameId(Layout.class), layout.getPlid(),
			layout.getCompanyId(),
			ClientExtensionEntryConstants.TYPE_THEME_CSS);

		if (cet == null) {
			cet = _getCET(
				_portal.getClassNameId(Layout.class),
				layout.getMasterLayoutPlid(), layout.getCompanyId(),
				ClientExtensionEntryConstants.TYPE_THEME_CSS);
		}

		if (cet == null) {
			LayoutSet layoutSet = layout.getLayoutSet();

			cet = _getCET(
				_portal.getClassNameId(LayoutSet.class),
				layoutSet.getLayoutSetId(), layout.getCompanyId(),
				ClientExtensionEntryConstants.TYPE_THEME_CSS);
		}

		if (cet != null) {
			return (ThemeCSSCET)cet;
		}

		return null;
	}

	private String _getThemeFaviconCETURL(
		long classNameId, long classPK, long companyId) {

		CET cet = _getCET(
			classNameId, classPK, companyId,
			ClientExtensionEntryConstants.TYPE_THEME_FAVICON);

		if (cet == null) {
			return null;
		}

		ThemeFaviconCET themeFaviconCET = (ThemeFaviconCET)cet;

		return themeFaviconCET.getURL();
	}

	private ThemeJSCET _getThemeJSCET(Layout layout) {
		CET cet = _getCET(
			_portal.getClassNameId(Layout.class), layout.getPlid(),
			layout.getCompanyId(), ClientExtensionEntryConstants.TYPE_THEME_JS);

		if (cet == null) {
			cet = _getCET(
				_portal.getClassNameId(Layout.class),
				layout.getMasterLayoutPlid(), layout.getCompanyId(),
				ClientExtensionEntryConstants.TYPE_THEME_JS);
		}

		if (cet == null) {
			LayoutSet layoutSet = layout.getLayoutSet();

			cet = _getCET(
				_portal.getClassNameId(LayoutSet.class),
				layoutSet.getLayoutSetId(), layout.getCompanyId(),
				ClientExtensionEntryConstants.TYPE_THEME_JS);
		}

		if (cet != null) {
			return (ThemeJSCET)cet;
		}

		return null;
	}

	private ThemeSpritemapCET _getThemeSpritemapCET(Layout layout) {
		CET cet = _getCET(
			_portal.getClassNameId(Layout.class), layout.getPlid(),
			layout.getCompanyId(),
			ClientExtensionEntryConstants.TYPE_THEME_SPRITEMAP);

		if (cet == null) {
			cet = _getCET(
				_portal.getClassNameId(Layout.class),
				layout.getMasterLayoutPlid(), layout.getCompanyId(),
				ClientExtensionEntryConstants.TYPE_THEME_SPRITEMAP);
		}

		if (cet == null) {
			LayoutSet layoutSet = layout.getLayoutSet();

			cet = _getCET(
				_portal.getClassNameId(LayoutSet.class),
				layoutSet.getLayoutSetId(), layout.getCompanyId(),
				ClientExtensionEntryConstants.TYPE_THEME_SPRITEMAP);
		}

		if (cet != null) {
			return (ThemeSpritemapCET)cet;
		}

		return null;
	}

	@Reference
	private CETManager _cetManager;

	@Reference
	private ClientExtensionEntryRelLocalService
		_clientExtensionEntryRelLocalService;

	@Reference
	private LayoutLocalService _layoutLocalService;

	@Reference
	private Portal _portal;

}